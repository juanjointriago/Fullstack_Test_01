/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import {type Task,type Project, type FC, type FormEvent } from '../types';
import { projectService } from '../services/ProjectService';

interface TaskFormProps {
  initialData?: Task;
  projectId?: number;
  onSubmit: (taskData: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const TaskForm: FC<TaskFormProps> = ({ 
  initialData, 
  projectId,
  onSubmit, 
  onCancel,
  submitLabel = 'Crear Tarea'
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'pendiente');
  const [priority, setPriority] = useState(initialData?.priority || 'media');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || initialData?.project_id || 0);
  const [assignedTo, setAssignedTo] = useState(initialData?.assigned_to || 0);
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadCollaborators(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects(1, 100);
      setProjects(response.projects);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadCollaborators = async (projectId: number) => {
    try {
      const response = await projectService.getProjectById(projectId);
      setCollaborators(response.collaborators);
    } catch (err) {
      console.error('Error loading collaborators:', err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!selectedProjectId) {
      setError('Debes seleccionar un proyecto');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData: any = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        project_id: selectedProjectId,
        due_date: dueDate || undefined
      };

      if (assignedTo) {
        taskData.assigned_to = assignedTo;
      }

      await onSubmit(taskData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Ej: Implementar autenticación"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          rows={3}
          placeholder="Describe la tarea..."
          maxLength={1000}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
            Proyecto *
          </label>
          <select
            id="project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="input"
            disabled={isLoadingProjects || !!projectId}
            required
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
            Asignar a
          </label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(Number(e.target.value))}
            className="input"
          >
            <option value="">Sin asignar</option>
            {collaborators.map((collab) => (
              <option key={collab.id} value={collab.id}>
                {collab.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de vencimiento
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;