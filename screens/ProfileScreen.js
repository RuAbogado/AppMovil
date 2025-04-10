import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agenteModalVisible, setAgenteModalVisible] = useState(false);

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handleGetByCorreo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      let userEmail = await AsyncStorage.getItem("userEmail");

      if (!userEmail && token) {
        userEmail = decodeToken(token);
        if (userEmail) {
          await AsyncStorage.setItem("userEmail", userEmail);
        } else {
          Alert.alert("Error", "No se pudo obtener el correo.");
          setLoading(false);
          return;
        }
      }

      if (!token || !userEmail) {
        Alert.alert("Error", "No tienes una sesión activa.");
        setLoading(false);
        return;
      }

      const response = await api.get(`/cliente/email/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUserData(response.data);
      } else {
        Alert.alert("Aviso", "No se encontró el cliente.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      Alert.alert("Error", "Ocurrió un problema inesperado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetByCorreo();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userEmail");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <Image
        source={require("../assets/profile.png")}
        style={styles.profileImage}
      />

      <Text style={styles.titleUser}>
        {userData ? `${userData.name}` : "Sin nombre"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : userData ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>
              {`${userData.name} ${userData.lastname}`}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>
              {userData.telephone || "Sin número registrado"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.agentButton}
            onPress={() => setAgenteModalVisible(true)}
          >
            <Text style={styles.buttonText}>Ver información del agente</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ color: "#d9534f", marginBottom: 20 }}>
          No se encontraron datos.
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const token = await AsyncStorage.getItem("userToken");
          navigation.navigate("CambiarContraseña", { token });
        }}
      >
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal del agente */}
      {agenteModalVisible && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.subtitle}>Información del Agente</Text>

              <Text style={styles.modalLabel}>Nombre completo:</Text>
              <Text style={styles.modalValue}>
                {userData?.agente
                  ? `${userData.agente.name} ${userData.agente.lastname} ${
                      userData.agente.surname || ""
                    }`
                  : "No asignado"}
              </Text>

              <Text style={styles.modalLabel}>Correo:</Text>
              <Text style={styles.modalValue}>
                {userData?.agente?.email || "Sin correo"}
              </Text>

              <Text style={styles.modalLabel}>Teléfono:</Text>
              <Text style={styles.modalValue}>
                {userData?.agente?.telephone || "Sin número"}
              </Text>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setAgenteModalVisible(false)}
              >
                <Text style={styles.logoutButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 20,
  },
  titleUser: {
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
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  agentButton: {
    marginTop: 20,
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "85%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 10,
    textAlign: "center",
  },
  modalRow: {
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },
  modalValue: {
    fontSize: 16,
    color: "#333",
  },
});
