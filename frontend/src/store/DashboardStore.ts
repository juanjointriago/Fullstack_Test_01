
import { create } from 'zustand';
import { type DashboardStats } from '../types';
import { dashboardService } from '../services/DashboardService';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  // Fetch dashboard stats
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await dashboardService.getStats();
      set({
        stats,
        isLoading: false
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar estadísticas',
        isLoading: false
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));