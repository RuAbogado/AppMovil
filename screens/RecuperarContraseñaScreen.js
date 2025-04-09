import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function RecuperarContraseñaScreen({ navigation }) {
  const [correo, setCorreo] = useState("");

  const handleEnviarEnlace = async () => {
    if (!correo.trim()) {
      Alert.alert("Campo vacío", "Por favor ingresa un correo válido.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.74:8080/api/auth/forgot-password-movil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: correo }),
      });

      if (response.ok) {
        const mensaje = await response.text(); // respuesta del backend
        Alert.alert("Recuperación de contraseña", mensaje);
        navigation.goBack();
      } else {
        Alert.alert("Error", "No se pudo enviar el correo. Verifica el email.");
      }
    } catch (error) {
      console.error("❌ Error al enviar el correo:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.infoText}>
        Ingresa tu correo para recibir un enlace de recuperación.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleEnviarEnlace}>
        <Text style={styles.buttonText}>Enviar enlace</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>
    </View>
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
    color: "#008080",
  },
  infoText: {
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
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
