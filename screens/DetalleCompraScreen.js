import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from "react-native";

export default function DetalleCompraScreen({ route }) {
  const { compra } = route.params || { compra: {} };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Imagen del auto */}
        <Image source={compra.imagen} style={styles.carImage} />

        {/* Color del auto */}
        <View style={styles.colorContainer}>
          <View style={styles.colorCircle} />
          <Text style={styles.colorText}>Gris azulado</Text>
        </View>

        {/* Detalles de la compra */}
        <Text style={styles.carTitle}>{compra.modelo || "Modelo desconocido"}</Text>
        <Text style={styles.price}>
          Precio: <Text style={styles.priceHighlight}>$350,000.00 MXN</Text>
        </Text>

        {/* Sección Descripción */}
        <View style={styles.serviceCard}>
          <Text style={styles.sectionTitle}>Información de la compra</Text>
          <Text style={styles.text}>Folio: {compra.folio || "No disponible"}</Text>
          <Text style={styles.text}>Fecha de compra: {compra.fecha || "No especificada"}</Text>
        </View>

        {/* Lista de Servicios Contratados */}
        <Text style={styles.sectionTitle}>Servicios Contratados</Text>

        {compra.serviciosSeleccionados?.length > 0 ? (
          <FlatList
            data={compra.serviciosSeleccionados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.serviceTag}>
                <View>
                  <Text style={styles.serviceText}>{item.nombre}</Text>
                  <Text style={styles.serviceInfo}>Precio: {item.precio}</Text>
                  <Text style={styles.serviceInfo}>Duración: {item.duracion}</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noServices}>No se contrataron servicios adicionales.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  carImage: { width: "100%", height: 200, resizeMode: "contain" },
  carTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  text: { fontSize: 16, marginBottom: 5 },
  price: { textAlign: "center", fontSize: 16 },
  priceHighlight: { color: "#008080", fontWeight: "bold" },
  serviceCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
  serviceTag: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#ddd", padding: 10, borderRadius: 10, marginVertical: 10 },
  serviceText: { fontSize: 16, fontWeight: "bold" },
  serviceInfo: { fontSize: 14, color: "#555" },
  noServices: { textAlign: "center", color: "#888", marginVertical: 10 },
  colorContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#E0E0E0", borderRadius: 20, alignSelf: "center" },
  colorCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#A9B0B8", marginRight: 10 },
  colorText: { fontSize: 16, fontWeight: "bold", color: "#333", textAlign: "center" },
});
