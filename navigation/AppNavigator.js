// Modificaciones en AppNavigator.js
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
import CompraScreen from "../screens/CompraScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Historial" 
        component={HistorialScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="clock" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="MarcaDetalle" component={MarcaDetalleScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="CompraScreen" component={CompraScreen} />
      <Stack.Screen name="DetalleCompra" component={DetalleCompraScreen} />
      <Stack.Screen name="CambiarContraseña" component={CambiarContraseñaScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen} />
    </Stack.Navigator>
  );
}
