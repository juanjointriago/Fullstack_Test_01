
import api from './api';
import { type DashboardStats } from '../types';

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/dashboard');
    return response.data;
  }
};