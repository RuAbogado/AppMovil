import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const linking = {
    prefixes: [
      "http://localhost:8081",  // el link del correo
      "sega://"             // esquema nativo
    ],
    config: {
      screens: {
        Login: "login",
        Registro: "registro",
        RecuperarContraseña: "recuperar-contraseña",
        CambiarContraseña: "cambiar-contraseña",
        ResetPassword: "reset-password", // debe coincidir con el path del correo
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

  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
}
