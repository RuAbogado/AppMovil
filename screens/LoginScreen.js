import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      console.log("debe decirte que eso no se puede")
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.100.40:8080/api/auth/Login", {
        email: correo, 
        password: contraseña,
      });

      console.log("Respuesta del servidor:", response.data.token);

      // Si el login es exitoso
      if (response.data) {
        Alert.alert("Bienvenido", "Inicio de sesión exitoso.");
        await AsyncStorage.setItem("userToken", response.data.token);
        navigation.replace("HomeTabs"); // Navega a la pantalla principal
      } else {
        Alert.alert("Error", response.data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <ImageBackground source={require("../assets/fondo.png")} style={styles.background}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SEGA</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => navigation.navigate("RecuperarContraseña")}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>Aún no tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 50,
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 25,
    backgroundColor: "#F8F8F8",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#018180",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#018180",
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerTextContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    color: "#018180",
    fontWeight: "bold",
  },
});
