import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import HomeTabs from "./navigation/AppNavigator"; // usamos solo el stack interno
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.error("Error al leer el token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const linking = {
    prefixes: [
      "http://localhost:8081",
      "sega://"
    ],
    config: {
      screens: {
        Login: "login",
        Registro: "registro",
        RecuperarContraseña: "recuperar-contraseña",
        CambiarContraseña: "cambiar-contraseña",
        ResetPassword: "reset-password",
        HomeTabs: {
          screens: {
            Inicio: {
              screens: {
                HomeScreen: "home",
                MarcaDetalle: "marca/:id",
                CarDetail: "auto/:id",
                CompraScreen: "compra",
                DetalleCompraHome: "detalle-compra",
              },
            },
            Historial: {
              screens: {
                HistorialMain: "historial",
                DetalleCompraHistorial: "detalle-compra-historial",
              },
            },
            Perfil: {
              screens: {
                PerfilMain: "perfil",
              },
            },
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#018180" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {userToken ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        </Stack.Navigator>
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}
