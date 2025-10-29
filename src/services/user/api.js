import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: 'https://foul-spooky-cobweb-g4wvw6jr55vcq66-8000.app.github.dev/api/v1',
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