/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import { type Task, type TaskFilters } from '../types';
import { taskService } from '../services/TaskService';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  totalTasks: number;
  currentPage: number;
  totalPages: number;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (filters?: TaskFilters, page?: number, limit?: number) => Promise<void>;
  fetchTaskById: (id: number) => Promise<void>;
  createTask: (taskData: any) => Promise<Task>;
  updateTask: (id: number, taskData: any) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  clearCurrentTask: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  totalTasks: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {},
  isLoading: false,
  error: null,

  // Fetch tasks
  fetchTasks: async (filters = {}, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTasks(filters, page, limit);
      set({
        tasks: response.tasks,
        totalTasks: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        filters,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar tareas',
        isLoading: false
      });
    }
  },

  // Fetch task by ID
  fetchTaskById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTaskById(id);
      set({
        currentTask: response.task,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar la tarea',
        isLoading: false
      });
    }
  },

  // Create task
  createTask: async (taskData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(taskData);
      
      // Refresh tasks list
      await get().fetchTasks(get().filters, get().currentPage);
      
      set({ isLoading: false });
      return response.task;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (id: number, taskData: any) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.updateTask(id, taskData);
      
      // Refresh tasks list
      await get().fetchTasks(get().filters, get().currentPage);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(id);
      
      // Refresh tasks list
      await get().fetchTasks(get().filters, get().currentPage);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  // Set filters
  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} });
  },

  // Clear current task
  clearCurrentTask: () => {
    set({ currentTask: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));