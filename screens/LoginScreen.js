import React from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <ImageBackground source={require("../assets/fondo.png")} style={styles.background}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SEGA</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <TextInput style={styles.input} placeholder="Correo" />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry />
        <TouchableOpacity onPress={() => navigation.navigate("RecuperarContraseña")}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("HomeTabs")}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>
            Aún no tienes cuenta?{" "}
          </Text>
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
    flexDirection: "row", // Añadido para que "Aún no tienes cuenta?" y "Regístrate" estén en la misma línea
    marginTop: 15,
    justifyContent: "center", // Alinea los elementos al centro
  },
  registerText: {
    marginRight: 5, // Para mantener la separación entre el texto y el enlace
  },
  registerLink: {
    color: "#018180",
    fontWeight: "bold",
  },
});