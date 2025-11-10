import axios, { type AxiosInstance, AxiosError } from 'axios';
import { API_URL } from '../utils/constants';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';

      // Solo hacer logout si es un error de token inválido o expirado
      if (
        errorMessage.includes('Token') ||
        errorMessage.includes('token') ||
        errorMessage.includes('autenticación') ||
        errorMessage.includes('Unauthorized')
      ) {
        // Importar dinámicamente para evitar dependencias circulares
        const { useAuthStore } = await import('../store/AuthStore');
        const logout = useAuthStore.getState().logout;

        // Limpiar autenticación
        logout();

        // Redirigir a login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;