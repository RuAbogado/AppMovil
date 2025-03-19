
// src/apiConfig.js
import axios from "axios";
const ip = "192.168.197.75"

// Configura la URL base
const API_BASE_URL = `http://${ip}:8080`;

// Crea una instancia de axios con la configuración predefinida

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
