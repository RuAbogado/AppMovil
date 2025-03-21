import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";

export default function CambiarContraseñaScreen({ route, navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  // 🎯 Obtener el token desde los params o AsyncStorage
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = route.params?.token || (await AsyncStorage.getItem("resetToken"));
      console.log("🔑 Token recibido:", savedToken);

      if (!savedToken) {
        Alert.alert("Error", "No se encontró el token. Por favor, solicita un nuevo correo de restablecimiento.");
        navigation.navigate("Login");
      } else {
        setToken(savedToken.trim());
      }
    };
    loadToken();
  }, []);

  // 🔥 Validación y envío del nuevo password
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      console.log("🔧 Enviando nueva contraseña...");

      const response = await api.post(
        "/api/auth/reset-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente.");
      await AsyncStorage.removeItem("resetToken"); // Limpieza del token
      navigation.navigate("Login");
    } catch (error) {
      console.error("❌ Error al actualizar la contraseña:", error.response?.status, error.response?.data || error.message);
      Alert.alert("Error", error.response?.data || "No se pudo actualizar la contraseña.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.cancelButtonText}>Cambiar contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎯 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
