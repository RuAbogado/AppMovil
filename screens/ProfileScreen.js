import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function ProfileScreen({ navigation }) {
  
  const handleLogout = () => {
    // 🔹 Aquí podrías limpiar datos de sesión si es necesario antes de salir
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // ✅ Elimina el historial y lleva al usuario al Login
    });
  };

  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
      <Image source={require("../assets/profile.jpeg")} style={styles.profileImage} />

      {/* Información del usuario */}
      <Text style={styles.title}>Perfil de Usuario</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>Rubén Gómez Hernández</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>20233tn207@utez.edu.mx</Text>
      </View>

      {/* Botón para cambiar contraseña */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CambiarContraseña")}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});