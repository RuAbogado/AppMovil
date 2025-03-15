import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const compras = [
  {
    id: "1",
    folio: "000001",
    modelo: "Aveo sedán 2025",
    fecha: "18/02/2025",
    imagen: require("../assets/aveo.jpeg"),
    precio: "350,000.00 MXN",
    serviciosSeleccionados: [
      { id: "1", nombre: "Cambio de aceite", precio: "500$", duracion: "Mensual" },
      { id: "2", nombre: "Alineación y balanceo", precio: "700$", duracion: "Cada 6 meses" },
    ],
  },
  {
    id: "2",
    folio: "000002",
    modelo: "Aveo sedán 2025",
    fecha: "18/02/2025",
    imagen: require("../assets/aveo.jpeg"),
    precio: "350,000.00 MXN",
    serviciosSeleccionados: [],
  },
  {
    id: "3",
    folio: "000003",
    modelo: "Aveo sedán 2025",
    fecha: "18/02/2025",
    imagen: require("../assets/aveo.jpeg"),
    precio: "350,000.00 MXN",
    serviciosSeleccionados: [
      { id: "3", nombre: "Frenos", precio: "1200$", duracion: "Anual" },
    ],
  },
  {
    id: "4",
    folio: "000004",
    modelo: "Aveo sedán 2025",
    fecha: "18/02/2025",
    imagen: require("../assets/aveo.jpeg"),
    precio: "350,000.00 MXN",
    serviciosSeleccionados: [
      { id: "1", nombre: "Cambio de aceite", precio: "500$", duracion: "Mensual" },
      { id: "3", nombre: "Frenos", precio: "1200$", duracion: "Anual" },
    ],
  },
  {
    id: "5",
    folio: "000005",
    modelo: "Aveo sedán 2025",
    fecha: "18/02/2025",
    imagen: require("../assets/aveo.jpeg"),
    precio: "350,000.00 MXN",
    serviciosSeleccionados: [
      { id: "2", nombre: "Alineación y balanceo", precio: "700$", duracion: "Cada 6 meses" },
    ],
  },
];

export default function HistorialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Compras</Text>
      <FlatList
        data={compras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.folio}>Folio: {item.folio}</Text>
            <Text style={styles.modelo}>{item.modelo}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("DetalleCompra", { compra: item })} // ✅ Se pasan todos los datos
            >
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 3 },
  folio: { fontSize: 16, fontWeight: "bold" },
  modelo: { fontSize: 16, fontStyle: "italic", color: "#018180" },
  fecha: { fontSize: 14, color: "#666" },
  button: { backgroundColor: "#018180", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
