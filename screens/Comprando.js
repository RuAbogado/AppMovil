import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import segaLogo from "../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Comprando({ route, navigation }) {
  const { auto = {}, serviciosSeleccionados = [], agenteId } = route.params || {};

  const [clienteId, setClienteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = auto.precio || 0;
  const totalServicios = Array.isArray(serviciosSeleccionados)
    ? serviciosSeleccionados.reduce((acc, s) => acc + parseInt(s.price?.replace("$", "") || 0, 10), 0)
    : 0;
  const total = subtotal + totalServicios;

  const getEmailFromToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return null;
    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      return payload.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const fetchClienteId = async () => {
    const email = await getEmailFromToken();
    if (!email) return;
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/cliente/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.id) setClienteId(response.data.id);
    } catch (error) {
      console.error("Error fetching cliente:", error);
    }
  };

  useEffect(() => {
    fetchClienteId();
  }, []);

  const actualizarEstadoVehiculo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.put(
        `/vehiculo/actualizar/${auto.id}`,
        { ...auto, estado: { id: 2 } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return false;
    }
  };

  const confirmarCompra = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const estadoActualizado = await actualizarEstadoVehiculo();
      if (!estadoActualizado) throw new Error("No se actualizó el estado");

      const token = await AsyncStorage.getItem("userToken");
      const ventaData = {
        cliente: { id: clienteId },
        vehiculo: { id: auto.id },
        agente: agenteId ? { id: agenteId } : null,
        ventaServicios: serviciosSeleccionados.map(s => ({ servicio: { id: s.id } })),
        precioFinal: total,
        date: new Date().toISOString()
      };

      const ventaResponse = await api.post("/ventas/vender", ventaData, {
      
        headers: { Authorization: `Bearer ${token}` }
      
      
      });

      if (ventaResponse.status >= 200 && ventaResponse.status < 300) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Compra fallida:", error);
      Alert.alert("Error", error.response?.data?.message || "Fallo la compra");
    } finally {
      setLoading(false);
    }
  };

  const generarYCompartirPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align:center;">Factura de Venta de Automóvil</h2>
            <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString("es-MX")}</p>
            <p><strong>Folio de compra:</strong> ${auto.folio || "000000"}</p>
            <p><strong>Vendedor:</strong> Autos Cuernavaca S.A. de C.V.</p>
            <p><strong>Comprador:</strong> ${auto.cliente || "Cliente"}</p>
            <br>
            <p><strong>Marca:</strong> ${auto.marca?.nombre}</p>
            <p><strong>Modelo:</strong> ${auto.modelo} ${auto.year}</p>
            <p><strong>Placa:</strong> ${auto.matricula}</p>
            <br>
            <table border="1" cellpadding="6" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th align="left">Servicio / producto</th>
                  <th align="right">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${serviciosSeleccionados.map(s => `<tr><td>${s.name}</td><td align="right">${s.price}</td></tr>`).join("")}
                <tr><td>Automóvil</td><td align="right">$${subtotal.toLocaleString()}</td></tr>
              </tbody>
            </table>
            <h3 style="text-align: right;">Total a pagar: $${total.toLocaleString()}</h3>
            <p style="color: red; font-size: 12px; text-align:center;">
              Gracias por su compra. Dirijase a una de nuestras sucursales para que un agente pueda procesar su compra.
            </p>
            
            <div style="text-align: center; margin-top: 60px;">
              <p><strong>S E G A</strong></p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error("Error al generar o compartir PDF:", err);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

 return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la compra</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información del vehículo</Text>
        <Text style={styles.text}>Matrícula: {auto.matricula}</Text>
        <Text style={styles.text}>Color: {auto.color}</Text>
        <Text style={styles.text}>Marca: {auto.marca?.nombre}</Text>
        <Text style={styles.text}>Año: {auto.year}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        {serviciosSeleccionados.length > 0 ? (
          serviciosSeleccionados.map((servicio, i) => (
            <View key={i} style={styles.serviceTag}>
              <Text>{servicio.name} - {servicio.price}</Text>
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
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setShowConfirmModal(true)}
        >
          <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
        </TouchableOpacity>
      )}

      {/* Modal de confirmación */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Estás seguro?</Text>
            <Text style={styles.modalText}>Esta acción es irreversible.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarCompra}>
                <Text style={styles.confirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡Compra exitosa!</Text>
            <Text style={styles.text}>Gracias por tu compra.</Text>
            <Text style={styles.text}>Total pagado: ${total.toLocaleString()}</Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={generarYCompartirPDF}
            >
              <Text style={styles.confirmButtonText}>Ver PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("HomeTabs",{auto, serviciosSeleccionados, agenteId});
              }}
            >
              <Text style={styles.downloadButtonText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  infoContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#008080" },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10
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

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center"
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelText: { color: "#777", fontWeight: "bold", fontSize: 16 },
  confirmText: { color: "#008080", fontWeight: "bold", fontSize: 16 }
});

