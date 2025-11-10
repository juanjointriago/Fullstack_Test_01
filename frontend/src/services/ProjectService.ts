
import api from './api';
import { type Project, type PaginatedProjects, type ProjectDetail } from '../types';

export const projectService = {
  // Obtener todos los proyectos
  getProjects: async (page: number = 1, limit: number = 10): Promise<PaginatedProjects> => {
    const response = await api.get<PaginatedProjects>('/api/projects', {
      params: { page, limit }
    });
    return response.data;
  },

  // Obtener proyecto por ID
  getProjectById: async (id: number): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/api/projects/${id}`);
    return response.data;
  },

  // Crear proyecto
  createProject: async (name: string, description?: string): Promise<{ message: string; project: Project }> => {
    const response = await api.post<{ message: string; project: Project }>('/api/projects', {
      name,
      description
    });
    return response.data;
  },

  // Actualizar proyecto
  updateProject: async (id: number, name: string, description?: string): Promise<{ message: string; project: Project }> => {
    const response = await api.put<{ message: string; project: Project }>(`/api/projects/${id}`, {
      name,
      description
    });
    return response.data;
  },

  // Eliminar proyecto
  deleteProject: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/projects/${id}`);
    return response.data;
  },

  // Añadir colaborador
  addCollaborator: async (projectId: number, userId: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/api/projects/${projectId}/collaborators`, {
      userId
    });
    return response.data;
  },

  // Eliminar colaborador
  removeCollaborator: async (projectId: number, userId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/projects/${projectId}/collaborators/${userId}`);
    return response.data;
  }
};