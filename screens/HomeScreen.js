import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

const autosPorMarca = {
  Chevrolet: [
    { id: "1", nombre: "Aveo sedán 2025", imagen: require("../assets/aveo.jpeg") },
    { id: "2", nombre: "Aveo sedán 2025", imagen: require("../assets/aveo.jpeg") },
    { id: "3", nombre: "Aveo sedán 2025", imagen: require("../assets/aveo.jpeg") },
    { id: "4", nombre: "Aveo sedán 2025", imagen: require("../assets/aveo.jpeg") },
  ],
  Toyota: [],
  Ford: [],
  BMW: [],
  "Mercedes-Benz": [],
};

export default function HomeScreen({ navigation }) {
  const [selectedMarca, setSelectedMarca] = useState("Chevrolet");
  const [open, setOpen] = useState(false);  // Estado para manejar la apertura y cierre del dropdown
  const autos = autosPorMarca[selectedMarca] || [];

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open} // Controlar la apertura del dropdown
        value={selectedMarca} // Usamos value para manejar la selección
        items={Object.keys(autosPorMarca).map(marca => ({ label: marca, value: marca }))}
        setOpen={setOpen} // Función que cambia el estado 'open'
        setValue={setSelectedMarca} // Función para cambiar el estado 'selectedMarca'
        containerStyle={styles.picker}
        style={styles.dropdown}
        dropDownStyle={styles.dropdownMenu}
        placeholder="Selecciona una marca"
        placeholderStyle={{ color: "#BDBDBD" }} // Color del texto del placeholder
      />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#018180",
  },
  dropdownMenu: {
    backgroundColor: "#F5F5F5",
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