import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import api from "../src/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔥 IMPORTANTE: Agregado


export default function CarDetailScreen({ route, navigation }) {
  const { auto } = route.params;
  const [descripcionVisible, setDescripcionVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const serviciosDisponibles = [
    { id: "1", nombre: "Cambio de aceite", descripcion: "Se reemplaza el aceite viejo por uno nuevo y se cambia el filtro.", precio: "$500", duracion: "Mensual" },
    { id: "2", nombre: "Alineación y balanceo", descripcion: "Ajuste y balance de ruedas para mejorar el control.", precio: "$700", duracion: "Cada 6 meses" },
    { id: "3", nombre: "Frenos", descripcion: "Revisión y cambio de pastillas de freno.", precio: "$1200", duracion: "Anual" },
    { id: "4", nombre: "Cambio de batería", descripcion: "Sustitución de batería vieja.", precio: "$2000", duracion: "Cada 2 años" },
    { id: "5", nombre: "Lavado y encerado", descripcion: "Limpieza profunda y encerado.", precio: "$300", duracion: "Mensual" }
  ];

  const [servicios,setServicios] = useState([])


  const handleGetServicios = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No hay token guardado.");
        Alert.alert("Error", "No tienes una sesión activa.");
        return;
      }

      //console.log("Token recuperado:", token);

      const response = await api.get('/servicios/obtener', {
        headers: {
          Authorization: `Bearer ${token}` // 🔥 Agregado el token en la cabecera
        }
      });

      console.log("Respuesta del servidor locochon:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setServicios(response.data);
        //setSelectedMarca(response.data[0]?.nombre || null); // 🔥 Seleccionar la primera marca automáticamente

      } else {
        console.log("Error", "No se encontraron marcas disponibles.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };



  useEffect(() => {
    handleGetServicios(); // 🚀 Ahora sí se ejecuta al montar el componente
  }, []);

  // Función para agregar servicio a la lista
  const agregarServicio = (servicio) => {
    if (!serviciosSeleccionados.some((s) => s.id === servicio.id)) {
      setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
    }
    setModalVisible(false); // Cierra el modal después de seleccionar un servicio
  };

  // Función para eliminar servicio
  const eliminarServicio = (id) => {
    setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Imagen del auto */}
        <Image source={{uri: auto.imagen}} style={styles.carImage} />

        {/* Color del auto */}
        <View style={styles.colorContainer}>
          <View style={styles.colorCircle} />
          <Text style={styles.colorText}>{auto.color}</Text>
        </View>

        {/* Nombre y Precio */}
        <Text style={styles.carTitle}>{auto.nombre}</Text>
        <Text style={styles.price}>
          Precio: <Text style={styles.priceHighlight}>${auto.precio} MXN</Text>
        </Text>

        {/* Botón Comprar */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("CompraScreen", { auto, serviciosSeleccionados })}
        >
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>

        {/* Sección Descripción con despliegue */}
        <TouchableOpacity style={styles.toggleButton} onPress={() => setDescripcionVisible(!descripcionVisible)}>
          <Text style={styles.sectionTitle}>
            {descripcionVisible ? "Ocultar descripción " : "Descripción "}
          </Text>
        </TouchableOpacity>

        {descripcionVisible && (
          <View style={styles.serviceCard}>
            <Text style={styles.description}>
              {auto.description}
            </Text>
          </View>
        )}

        {/* Lista de Servicios Seleccionados */}
        <Text style={styles.sectionTitle}>Servicios</Text>

        {serviciosSeleccionados.length > 0 ? (
          <FlatList
            data={serviciosSeleccionados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.serviceTag}>
                <View>
                  <Text style={styles.serviceText}>{item.name}</Text>
                  <Text style={styles.serviceInfo}>Precio: {item.price}</Text>
                  {item.modalidad?.nombre && (
                      <Text style={styles.serviceInfo}>Duración: {item.modalidad.nombre}</Text>
                    )}

                </View>
                <TouchableOpacity onPress={() => eliminarServicio(item.id)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noServices}>No has seleccionado servicios.</Text>
        )}
      </ScrollView>

      {/* Botón Agregar Servicio siempre visible */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar servicio</Text>
      </TouchableOpacity>

      {/* Modal de Servicios Mejorado */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Servicios Disponibles</Text>
            <FlatList
              data={servicios}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.serviceOption} onPress={() => agregarServicio(item)}>
                  <Text style={styles.serviceTitle}>{item.name}</Text>
                  <Text style={styles.serviceDescription}>{item.description}</Text>
                  <Text style={styles.servicePrice}>Precio: {item.price} | {item.modalidad?.nombre}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Botón Cerrar Modal */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5"},
  carImage: { width: "100%", height: 200, resizeMode: "contain"},
  carTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  description: { textAlign: "justify", fontSize: 14, color: "#333", marginVertical: 10 },
  serviceCard: { backgroundColor: "#f9f9f9", padding: 15, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  price: { textAlign: "center", fontSize: 16 },
  priceHighlight: { color: "#008080", fontWeight: "bold" },
  buyButton: { backgroundColor: "#008080", padding: 10, borderRadius: 10, alignItems: "center", marginVertical: 10 },
  buyButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  serviceTag: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#ddd", padding: 10, borderRadius: 10, marginVertical: 10 },
  addButton: { backgroundColor: "#008080", padding: 10, borderRadius: 10, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  colorContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#E0E0E0", borderRadius: 20, alignSelf: "center" },
  colorCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#A9B0B8", marginRight: 10 },
  colorText: { fontSize: 16, fontWeight: "bold", color: "#333", textAlign: "center" },
  toggleButton: { marginTop: -10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, width: "90%", borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#008080", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#fff", padding: 15, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#ddd", marginTop: 10 },
  cancelButtonText: { color: "#555", fontSize: 16, fontWeight: "bold" },
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, width: "90%", maxHeight: "80%", borderRadius: 15, alignItems: "center", elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  serviceOption: { padding: 15, borderBottomWidth: 1, borderColor: "#ddd", width: "100%", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 10, marginVertical: 5 },
  serviceTitle: { fontSize: 18, fontWeight: "bold", color: "#008080" },
  serviceDescription: { fontSize: 14, color: "#666", textAlign: "center", marginVertical: 5 },
  servicePrice: { fontWeight: "bold", color: "#000", fontSize: 16 },
  cancelButton: { backgroundColor: "#008080", padding: 10, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 10 },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});