import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert, SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";

export default function HistorialScreen({ navigation }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEmailFromToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return null;

    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      return payload.sub;
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      return null;
    }
  };

  const fetchCompras = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No tienes una sesión activa.");
        return;
      }

      const email = await getEmailFromToken();
      if (!email) {
        Alert.alert("Error", "No se pudo obtener tu correo desde el token.");
        return;
      }

      // Obtener ID del cliente por email
      const clienteResp = await api.get(`/cliente/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const clienteId = clienteResp.data?.id;
      if (!clienteId) {
        Alert.alert("Error", "No se encontró el cliente.");
        return;
      }

      // Obtener ventas del cliente
      const response = await api.get(`/ventas/porCliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const ventas = Array.isArray(response.data) ? response.data : [response.data];

      const comprasFormateadas = ventas.map((venta) => ({
        id: venta.id.toString(),
        folio: venta.folio || venta.id.toString().padStart(6, "0"),
        modelo: venta.vehiculo?.modelo || "Desconocido",
        marca: venta.vehiculo?.marca?.nombre || "Marca desconocida",
        year: venta.vehiculo?.year || "",
        placa: venta.vehiculo?.matricula || "N/A",
        imagen: venta.vehiculo?.imagen || null,
        precio: venta.precioFinal?.toLocaleString("es-MX") || "0",
        subtotal: venta.vehiculo?.precio || 0,
        telefono: venta.agente?.telefono || "No disponible",
        correo: venta.agente?.correo || "No disponible",
        serviciosSeleccionados: (venta.ventaServicios || []).map((vs) => ({
          id: vs.servicio?.id,
          nombre: vs.servicio?.name || vs.servicio?.nombre,
          precio: vs.servicio?.price || vs.servicio?.precio,
          duracion: vs.servicio?.modalidad?.nombre || "sin modalidad"
        })),
      }));

      setCompras(comprasFormateadas);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      Alert.alert("Error", "No se pudo cargar el historial de compras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCompras();
    });
  
    return unsubscribe;
  }, [navigation]);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#018180" />
      </View>
    );
  }

  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Compras</Text>
      <FlatList
        data={compras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.folio}>Folio: {item.folio}</Text>
            <Text style={styles.modelo}>Modelo: {item.modelo}</Text>
            

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("DetalleCompraHistorial", {
                  compra: item
                });
              }}
            >
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginTop: 20, 
    marginBottom: 40 
  },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  folio: { fontSize: 16, fontWeight: "bold" },
  modelo: { fontSize: 16, color: "#018180" },
  agente: { fontSize: 14, color: "#444", marginTop: 5 },
  button: {
    backgroundColor: "#018180",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
