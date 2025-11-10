
import api from './api';
import { type AuthResponse, type User } from '../types';

export const authService = {
  // Registrar usuario
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      name,
      email,
      password
    });
    return response.data;
  },

  // Iniciar sesión
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Obtener perfil
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/api/auth/profile');
    return response.data;
  },

  // Guardar token y usuario en localStorage
  saveAuth: (token: string, user: User): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Obtener usuario
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};