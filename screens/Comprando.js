import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";
import ProfileScreen from "./ProfileScreen";

export default function Comprando({ route, navigation }) {
  const { auto = {}, serviciosSeleccionados = [], agenteId } = route.params || {};
  const [clienteId, setClienteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal,setModal] = useState(false)
  
  // Calcular el total
  const subtotal = auto.precio || 0;
  const totalServicios = Array.isArray(serviciosSeleccionados)
    ? serviciosSeleccionados.reduce((acc, servicio) => {
        const precio = servicio.price || "$0";
        return acc + parseInt(precio.replace("$", ""), 10);
      }, 0)
    : 0;
  const total = subtotal + totalServicios;

  // Obtener email del token
  const getEmailFromToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "No se encontró el token de autenticación.");
      return null;
    }

    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      return payload.sub;
    } catch (error) {
      Alert.alert("Error", "No se pudo decodificar el token.");
      console.error(error);
      return null;
    }
  };

  // Obtener ID del cliente
  const fetchClienteId = async () => {
    const email = await getEmailFromToken();
    if (!email) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/cliente/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.id) {
        setClienteId(response.data.id);
      } else {
        Alert.alert("Error", "No se encontró el ID del cliente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener el ID del cliente.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClienteId();
  }, []);

  // Actualizar estado del vehículo
  const actualizarEstadoVehiculo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.put(
        `/vehiculo/actualizar/${auto.id}`,
        {
          ...auto, // Mantener todos los datos actuales
          estado: { id: 2}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      return false;
    }
  };

  // Confirmar compra
  const confirmarCompra = async () => {
    if (!clienteId) {
      Alert.alert("Error", "No se pudo obtener el ID del cliente.");
      return;
    }

    setLoading(true);

    try {
      // 1. Actualizar estado del vehículo
      const estadoActualizado = await actualizarEstadoVehiculo();
      if (!estadoActualizado) {
        throw new Error("No se pudo actualizar el estado del vehículo");
      }

      // 2. Crear la venta
      const ventaData = {
        cliente: { id: clienteId },
        vehiculo: { id: auto.id },
        agente: agenteId ? { id: agenteId } : null,
        ventaServicios: serviciosSeleccionados?.map(s => ({ servicio: { id: s.id } })) || [],
        precioFinal: total,
        date: new Date().toISOString()
      };

      const token = await AsyncStorage.getItem("userToken");
      const ventaResponse = await api.post("/ventas", ventaData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (ventaResponse.status >=  200 && ventaResponse.status < 300) {
        Alert.alert("Éxito", "Compra realizada con éxito!");
        navigation.navigate("HomeTabs")
      }
    } catch (error) {
      console.error("Error en confirmarCompra:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || 
        "No se pudo completar la compra. Por favor intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de la compra</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información del vehículo</Text>
        <Text style={styles.text}>Matrícula: {auto.matricula || "N/A"}</Text>
        <Text style={styles.text}>Color: {auto.color || "N/A"}</Text>
        <Text style={styles.text}>Marca: {auto.marca?.nombre || "N/A"}</Text>
        <Text style={styles.text}>Año: {auto.year || "N/A"}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        {serviciosSeleccionados?.length > 0 ? (
          serviciosSeleccionados.map((servicio, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text>{servicio.name} - {servicio.price || "$0"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No se seleccionaron servicios.</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Precios</Text>
        <Text style={styles.text}>Vehículo: ${subtotal.toLocaleString()}</Text>
        <Text style={styles.text}>Servicios: ${totalServicios.toLocaleString()}</Text>
        <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={confirmarCompra}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.downloadButton}
            disabled={loading}
          >
            <Text style={styles.downloadButtonText}>Descargar Factura</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, padding: 30 },
  infoContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#008080" },
  confirmButton: { 
    backgroundColor: "#4CAF50", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginVertical: 10,
    opacity: 1
  },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  downloadButton: { 
    backgroundColor: "#008080", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginVertical: 10 
  },
  downloadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  serviceTag: { backgroundColor: "#ddd", padding: 10, borderRadius: 10, marginVertical: 5 },
});