import axios, { AxiosResponse, AxiosError } from 'axios';

// Log para debug
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Creamos una instancia de axios con la configuración base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Agregamos CORS headers
    'Access-Control-Allow-Origin': '*',
  },
});

// Agregamos un interceptor de solicitud para debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export default api;