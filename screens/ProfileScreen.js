import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/apiConfig";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Decodificador de JWT para extraer el correo
  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub; // El email suele venir en "sub"
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  // 🔥 Función para obtener los datos del usuario por su correo
  const handleGetByCorreo = async () => {
    try {
      console.log("📥 Intentando obtener token y correo...");

      const token = await AsyncStorage.getItem("userToken");
      let userEmail = await AsyncStorage.getItem("userEmail");

      console.log("🔍 Token:", token);
      console.log("🔍 Email:", userEmail);

      // Si no hay email guardado, lo sacamos del token
      if (!userEmail && token) {
        console.log("📩 No hay email guardado. Extrayendo del token...");
        userEmail = decodeToken(token);

        if (userEmail) {
          console.log("✅ Email extraído del token:", userEmail);
          await AsyncStorage.setItem("userEmail", userEmail); // Guardamos el email
        } else {
          console.log("🚨 No se pudo extraer el email del token.");
          Alert.alert("Error", "No se pudo obtener el correo.");
          setLoading(false);
          return;
        }
      }

      if (!token || !userEmail) {
        console.log("🚨 No hay token o correo guardado.");
        Alert.alert("Error", "No tienes una sesión activa.");
        setLoading(false);
        return;
      }
      

      console.log("🌐 Buscando cliente con correo:", userEmail);
      console.log("token " +  token)
      const response = await api.get(`/cliente/email/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data) {
        setUserData(response.data);
      } else {
        console.log("⚠️ No se encontró el cliente con ese correo.");
        Alert.alert("Aviso", "No se encontró el cliente.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);

      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Algo salió mal en el servidor.");
      } else if (error.request) {
        console.error("No hubo respuesta del servidor:", error.request);
        Alert.alert("Error", "No se recibió respuesta del servidor.");
      } else {
        console.error("Error en la configuración:", error.message);
        Alert.alert("Error", "Ocurrió un problema inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Cargamos los datos al montar el componente
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
      {/* Imagen de perfil */}
      <Image source={require("../assets/profile.jpeg")} style={styles.profileImage} />

      {/* Información del usuario */}
      <Text style={styles.title}>Perfil de Usuario</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : userData ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nombre completo:</Text>
            <Text style={styles.value}>
              {`${userData.name} ${userData.lastname} ${userData.surname || ""}`}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>
              {userData.telephone ? userData.telephone : "Sin número registrado"}
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ color: "#d9534f", marginBottom: 20 }}>No se encontraron datos.</Text>
      )}

      {/* Botón para cambiar contraseña */}
              

        <TouchableOpacity style={styles.button} onPress={async () => {
            const token = await AsyncStorage.getItem("userToken");
            navigation.navigate("CambiarContraseña", { token }); // Solo pasamos el token
            }}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎯 Estilos
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
