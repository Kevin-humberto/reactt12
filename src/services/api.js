// src/services/api.js
import axios from 'axios';

// 🚀 Usamos la variable de entorno de Vite
// import.meta.env.VITE_REACT_APP_API_URL
// Si la variable no está definida, usamos 'http://localhost:8000' como fallback seguro.
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000'; 

const api = axios.create({

  baseURL: API_BASE_URL, 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Response Error:', error);
    return Promise.reject(error);
  }
);

export default api;