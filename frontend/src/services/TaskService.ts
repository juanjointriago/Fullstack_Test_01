
import api from './api';
import { type Task, type PaginatedTasks, type TaskFilters } from '../types';

export const taskService = {
  // Obtener todas las tareas con filtros
  getTasks: async (filters: TaskFilters = {}, page: number = 1, limit: number = 20): Promise<PaginatedTasks> => {
    const response = await api.get<PaginatedTasks>('/api/tasks', {
      params: { ...filters, page, limit }
    });
    return response.data;
  },

  // Obtener tarea por ID
  getTaskById: async (id: number): Promise<{ task: Task }> => {
    const response = await api.get<{ task: Task }>(`/api/tasks/${id}`);
    return response.data;
  },

  // Crear tarea
  createTask: async (taskData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    project_id: number;
    assigned_to?: number;
    due_date?: string;
  }): Promise<{ message: string; task: Task }> => {
    const response = await api.post<{ message: string; task: Task }>('/api/tasks', taskData);
    return response.data;
  },

  // Actualizar tarea
  updateTask: async (id: number, taskData: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    assigned_to: number;
    due_date: string;
  }>): Promise<{ message: string; task: Task }> => {
    const response = await api.put<{ message: string; task: Task }>(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  // Eliminar tarea
  deleteTask: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/tasks/${id}`);
    return response.data;
  }
};