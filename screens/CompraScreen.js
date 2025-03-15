import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function CompraScreen({ route, navigation }) {
  // 🔹 Evitar errores si route.params es undefined
  const { auto = {}, serviciosSeleccionados = [] } = route.params || {}; 

  // 🔹 Calcular el total de los servicios
  const subtotal = 350000; // Precio base del auto
  const totalServicios = Array.isArray(serviciosSeleccionados)
    ? serviciosSeleccionados.reduce((acc, servicio) => acc + parseInt(servicio.precio.replace("$", "")), 0)
    : 0;

  const total = subtotal + totalServicios;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de la compra</Text>

      {/* Información del vehículo */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información del vehículo</Text>
        <Text style={styles.text}>No. de Factura: 0000-001</Text>
        <Text style={styles.text}>Matrícula: BAV-007</Text>
        <Text style={styles.text}>Color: {auto.color || "Gris azulado"}</Text>
        <Text style={styles.text}>Marca: {auto.marca || "Chevrolet"}</Text>
        <Text style={styles.text}>Año: {auto.año || "2025"}</Text>
        <Text style={styles.text}>Vendedor: Juan Pérez</Text>
        <Text style={styles.text}>Titular: Juan Gabriel</Text>
      </View>

            {/* Lista de servicios seleccionados */}
            <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        {Array.isArray(serviciosSeleccionados) && serviciosSeleccionados.length > 0 ? (
          serviciosSeleccionados.map((servicio, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text>{servicio.nombre} - {servicio.precio} / {servicio.duracion}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No se seleccionaron servicios.</Text>
        )}
      </View>

      {/* Información de precios */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Precios</Text>
        <Text style={styles.text}>Subtotal: ${subtotal.toLocaleString()} MXN</Text>
        <Text style={styles.text}>+Servicios: ${totalServicios.toLocaleString()} MXN</Text>
        <Text style={styles.totalText}>Total: ${total.toLocaleString()} MXN</Text>
      </View>

      {/* Botón de descarga de factura */}
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>Descargar Factura</Text>
      </TouchableOpacity>
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
  downloadButton: { backgroundColor: "#008080", padding: 12, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  downloadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  serviceTag: { backgroundColor: "#ddd", padding: 10, borderRadius: 10, marginVertical: 5 },
});