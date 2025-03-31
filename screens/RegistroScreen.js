import React, { useState } from "react";
import {SafeAreaView ,View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../src/apiConfig";

export default function RegistroScreen({ navigation }) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");

  const handleRegister = async () => {
    if (!name || !lastname || !surname || !email || !password || !telephone) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const clienteData = {
      name,
      lastname,
      surname,
      email,
      password,
      telephone
    };

    try {
      const response = await api.post("/api/auth/registerCliente", clienteData);

      if (response.data) {
        Alert.alert("Registro Exitoso", "Tu cuenta ha sido creada correctamente.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message || "No se pudo completar el registro.");
      }
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "No se pudo conectar con el servidor.");
    }
  };

  return (
     <SafeAreaView  style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Apellido Paterno" value={lastname} onChangeText={setLastname} />
      <TextInput style={styles.input} placeholder="Apellido Materno" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Teléfono" value={telephone} onChangeText={setTelephone} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backText: {
    marginTop: 15,
    color: "#008080",
  },
});
