import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import api from "../src/apiConfig";

export default function ResetPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getTokenFromUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        const jwt = parsed.queryParams?.token;
        if (jwt) {
          setToken(jwt);
        } else {
          Alert.alert("Error", "Token de recuperación inválido o faltante.");
        }
      } else {
        Alert.alert("Error", "No se pudo obtener la URL del enlace.");
      }
    };

    getTokenFromUrl();
  }, []);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Campos vacíos", "Completa ambos campos.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Contraseña débil", "Debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Contraseñas no coinciden", "Verifica los campos.");
      return;
    }

    try {
      const response = await api.post(
        "/api/auth/reset-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Éxito", "Tu contraseña ha sido restablecida.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data || "No se pudo restablecer la contraseña.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Restablecer Contraseña</Text>

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Nueva contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backText}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backText: {
    color: "#008080",
    marginTop: 20,
  },
});
