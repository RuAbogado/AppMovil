import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";



export default function MarcaDetalleScreen({ route, navigation }) {
  const { marca } = route.params;
  const autos = autosPorMarca[marca] || [];

  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
    <View style={styles.container}>
      {/* Encabezado con el logo de la marca */}
      <View style={styles.header}>
        <Image source={require("../assets/chevrolet.png")} style={styles.logo} />
      </View>

      <FlatList
        data={autos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imagen} style={styles.image} />
            <Text style={styles.carName}>{item.nombre}</Text>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("CarDetail", { auto: item })}
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
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 250,
    height: 140,
    resizeMode: "contain",
  },
  carName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#018180",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});