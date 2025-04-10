import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [marcasBack, setMarcasBack] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [open, setOpen] = useState(false);
  const [autosBack, setAutosBack] = useState([]);
  const primerVez = useRef(true);

  const handleGetMarcas = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token guardado.");
        Alert.alert("Error", "No tienes una sesión activa.");
        return;
      }

      const response = await api.get("/marcas/getAll", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Respuesta del servidor:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setMarcasBack(response.data);
      } else {
        console.log("Error", "No se encontraron marcas disponibles.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  const handleGetAutos = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token guardado.");
        Alert.alert("Error", "No tienes una sesión activa.");
        return;
      }

      const response = await api.get('/vehiculo/obtener', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Respuesta de autos:", response.data);
      setAutosBack(response.data);
      
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  const handleGetAutosByBrand = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token guardado.");
        Alert.alert("Error", "No tienes una sesión activa.");
        return;
      }

      console.log("Marca seleccionada:", selectedMarca);
      const response = await api.get(`/vehiculo/marca/${selectedMarca}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAutosBack(response.data);
      console.log("Autos por marca:", response.data);
      
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  useEffect(() => {
    if (primerVez.current) {
      handleGetMarcas();
      handleGetAutos();
      primerVez.current = false;
    } else {
      handleGetAutosByBrand();
    }
  }, [selectedMarca]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={styles.container}>

        <Text style={styles.title}>Catálogo de autos</Text>

        <DropDownPicker
          open={open}
          value={selectedMarca}
          items={marcasBack.map(marca => ({ label: marca.nombre, value: marca.nombre }))}
          setOpen={setOpen}
          setValue={setSelectedMarca}
          containerStyle={styles.picker}
          style={styles.dropdown}
          placeholder="Selecciona una marca"
          placeholderStyle={{ color: "#BDBDBD" }}
          listMode="SCROLLVIEW"
        />
        
        <FlatList
          data={autosBack}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.image} />
              <Text style={styles.carName}>{item.modelo}</Text>
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
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 40 
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
    flex: 1,
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
