import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistorialScreen from "../screens/HistorialScreen";
import DetalleCompraScreen from "../screens/DetalleCompraScreen";
import CambiarContraseñaScreen from "../screens/CambiarContraseñaScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RecuperarContraseñaScreen from "../screens/RecuperarContraseñaScreen";
import MarcaDetalleScreen from "../screens/MarcaDetalleScreen";
import CarDetailScreen from "../screens/CarDetailScreen";
import Comprando from "../screens/Comprando";
import ResetPasswordScreen from "../screens/ResetPasswordScreen"; // ✅ Asegúrate de que sea el correcto

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🏠 Stack de Inicio
function HomeStackTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MarcaDetalle" component={MarcaDetalleScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="CompraScreen" component={Comprando} />
      <Stack.Screen name="DetalleCompraHome" component={DetalleCompraScreen} />
    </Stack.Navigator>
  );
}

// 📜 Stack de Historial
function HistorialStackTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistorialMain" component={HistorialScreen} />
      <Stack.Screen name="DetalleCompraHistorial" component={DetalleCompraScreen} />
    </Stack.Navigator>
  );
}

// 👤 Stack de Perfil
function PerfilStackTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// 🔽 Tabs principales
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Inicio"
        component={HomeStackTab}
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialStackTab}
        options={{ tabBarIcon: ({ color }) => <Feather name="clock" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStackTab}
        options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// 🌐 Navegación general
export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Registro" component={RegistroScreen} />
      <RootStack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen} />
      <RootStack.Screen name="CambiarContraseña" component={CambiarContraseñaScreen} />
      <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <RootStack.Screen name="HomeTabs" component={HomeTabs} />
    </RootStack.Navigator>
  );
}
