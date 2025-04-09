import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await api.post("/api/auth/Login", {
        email: correo.toLowerCase().trim(),
        password: contraseña.trim(),
      });

      const { token, mustChangePassword } = response.data;

      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);

      if (mustChangePassword) {
        setModalVisible(true);
      } else {
        navigation.replace("HomeTabs");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "Credenciales incorrectas o no se pudo conectar con el servidor.");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const token = userToken;
      const response = await api.post(
        "/api/auth/change-password-movill",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contraseña cambiada con éxito:", response.data);
      setModalVisible(false);
      navigation.replace("HomeTabs");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      Alert.alert("Error", "No se pudo cambiar la contraseña.");
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
          <Text style={styles.registerText}>¿Aún no tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de cambio de contraseña */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambio de Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginTop: 10,
  },
});
