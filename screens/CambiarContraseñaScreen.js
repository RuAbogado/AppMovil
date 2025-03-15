import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function CambiarContraseñaScreen({ navigation }) {
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  const handleGuardar = () => {
    // 🔹 Aquí podrías agregar validaciones o lógica para cambiar la contraseña
    console.log("Contraseña cambiada con éxito");
    navigation.goBack(); // 🔹 Regresa a la pantalla de perfil
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contraseña actual:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={contraseñaActual}
        onChangeText={setContraseñaActual}
      />

      <Text style={styles.label}>Nueva contraseña:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={nuevaContraseña}
        onChangeText={setNuevaContraseña}
      />

      <Text style={styles.label}>Confirmar contraseña:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmarContraseña}
        onChangeText={setConfirmarContraseña}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});