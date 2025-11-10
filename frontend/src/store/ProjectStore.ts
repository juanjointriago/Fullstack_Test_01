/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import { type Project, type ProjectDetail } from '../types';
import { projectService } from '../services/ProjectService';

interface ProjectState {
  projects: Project[];
  currentProject: ProjectDetail | null;
  totalProjects: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: (page?: number, limit?: number) => Promise<void>;
  fetchProjectById: (id: number) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (id: number, name: string, description?: string) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addCollaborator: (projectId: number, userId: number) => Promise<void>;
  removeCollaborator: (projectId: number, userId: number) => Promise<void>;
  clearCurrentProject: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  totalProjects: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  // Fetch projects
  fetchProjects: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.getProjects(page, limit);
      set({
        projects: response.projects,
        totalProjects: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar proyectos',
        isLoading: false
      });
    }
  },

  // Fetch project by ID
  fetchProjectById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.getProjectById(id);
      set({
        currentProject: response,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar el proyecto',
        isLoading: false
      });
    }
  },

  // Create project
  createProject: async (name: string, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.createProject(name, description);
      
      // Refresh projects list
      await get().fetchProjects(get().currentPage);
      
      set({ isLoading: false });
      return response.project;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear el proyecto',
        isLoading: false
      });
      throw error;
    }
  },

  // Update project
  updateProject: async (id: number, name: string, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.updateProject(id, name, description);
      
      // Refresh current project if it's the one being updated
      if (get().currentProject?.project.id === id) {
        await get().fetchProjectById(id);
      }
      
      // Refresh projects list
      await get().fetchProjects(get().currentPage);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar el proyecto',
        isLoading: false
      });
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      
      // Refresh projects list
      await get().fetchProjects(get().currentPage);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar el proyecto',
        isLoading: false
      });
      throw error;
    }
  },

  // Add collaborator
  addCollaborator: async (projectId: number, userId: number) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.addCollaborator(projectId, userId);
      
      // Refresh current project
      await get().fetchProjectById(projectId);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Remove collaborator
  removeCollaborator: async (projectId: number, userId: number) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.removeCollaborator(projectId, userId);
      
      // Refresh current project
      await get().fetchProjectById(projectId);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar colaborador',
        isLoading: false
      });
      throw error;
    }
  },

  // Clear current project
  clearCurrentProject: () => {
    set({ currentProject: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));