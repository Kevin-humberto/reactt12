import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: 'https://secret-seance-wr9q549775rvhgpr-8000.app.github.dev/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'dummy_token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;