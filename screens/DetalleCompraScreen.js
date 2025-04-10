import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function DetalleCompraScreen({ route }) {
  const { compra: compraDesdeHistorial } = route.params || {};
  const [compra, setCompra] = useState(compraDesdeHistorial || null);
  const [loading, setLoading] = useState(!compraDesdeHistorial);

  useEffect(() => {
    if (compraDesdeHistorial) {
      setCompra(compraDesdeHistorial);
      setLoading(false);
    }
  }, []);

  if (loading || !compra) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#018180" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detalles de la compra</Text>

        {/* Imagen del vehículo */}
        <View style={styles.centeredImage}>
          <Image
            source={
              typeof compra.imagen === "string"
                ? { uri: decodeURIComponent(compra.imagen) }
                : compra.imagen
            }
            style={styles.image}
          />
        </View>

        <View style={styles.row}>
          {/* Información del vehículo */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Información del vehículo</Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Folio:</Text> {compra.folio}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Marca:</Text> {compra.marca || "-"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Modelo:</Text> {compra.modelo}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Placa:</Text>{" "}
              {compra.placa || compra.matricula || "-"}
            </Text>
          </View>
        </View>

        {/* Precios */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Precios</Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Subtotal:</Text> $
            {compra.subtotal?.toLocaleString("es-MX") || "0"}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>+ servicios:</Text> $
            {compra.serviciosSeleccionados
              ?.reduce((acc, s) => {
                const precio = parseFloat(s.precio || s.price || 0);
                return acc + precio;
              }, 0)
              .toLocaleString("es-MX")}
          </Text>

          <Text style={styles.label}>
            <Text style={styles.bold}>Total:</Text> ${compra.precio}
          </Text>
        </View>

        {/* Servicios */}
        {compra.serviciosSeleccionados?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios incluidos</Text>
            {compra.serviciosSeleccionados.map((servicio, index) => (
              <View key={index} style={styles.serviceCard}>
                <Text style={styles.serviceName}>
                  {servicio.nombre || servicio.name}
                </Text>
                <Text style={styles.serviceDetail}>
                  Precio: ${servicio.precio || servicio.price}
                </Text>
                <Text style={styles.serviceDetail}>
                  Duración: {servicio.duracion || servicio.modalidad || "-"}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footerText}>
          Si quieres la factura, debes ir a la agencia y solicitarla con tu
          agente de ventas.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#018180",
    paddingBottom: 5,
  },
  label: { fontSize: 16, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1, marginRight: 10 },
  centeredImage: { alignItems: "center", marginVertical: 20 },
  image: { width: 250, height: 140, resizeMode: "contain" },
  priceSection: { marginVertical: 20 },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  serviceName: { fontWeight: "bold", fontSize: 16, color: "#018180" },
  serviceDetail: { fontSize: 14, color: "#555" },
  footerText: {
    fontSize: 12,
    color: "#018180",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 40,
  },
});
