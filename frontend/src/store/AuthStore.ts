/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '../types';
import { authService } from '../services/AuthService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Inicializar autenticación desde localStorage
      initializeAuth: () => {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null
          });
        }
      },

      // Login
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          authService.saveAuth(response.token, response.user);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      // Register
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(name, email, password);
          authService.saveAuth(response.token, response.user);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al registrarse';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Update user
      updateUser: (user: User) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);