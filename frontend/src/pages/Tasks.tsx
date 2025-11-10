/* eslint-disable @typescript-eslint/no-explicit-any */

import {type FC,  useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpiner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import Pagination from '../components/Pagination';
import { useTaskStore } from '../store/TaskStore';
import { useProjectStore } from '../store/ProjectStore';
import { type TaskFilters } from '../types';

const Tasks: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');

  const {
    tasks,
    currentPage,
    totalPages,
    filters,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearFilters,
    clearError
  } = useTaskStore();

  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects(1, 100); // Cargar proyectos para el filtro
  }, [fetchTasks, fetchProjects]);

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setIsCreateModalOpen(false);
      setSuccessMessage('Tarea creada exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.debug(err);
      // Error manejado en el store
    }
  };

  const handleEditTask = async (taskData: any) => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, taskData);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      setSuccessMessage('Tarea actualizada exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.debug(err);

      // Error manejado en el store
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setDeleteConfirm(null);
      setSuccessMessage('Tarea eliminada exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.debug(err);

      // Error manejado en el store
    }
  };

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await updateTask(taskId, { status });
      setSuccessMessage('Estado actualizado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error al actualizar estado:', err);
      const errorMsg = err.response?.data?.message || 'Error al actualizar el estado de la tarea';

      // Mostrar el error en lugar de solo hacer console.debug
      if (err.response?.status === 403) {
        alert('No tienes permisos para modificar esta tarea');
      } else if (err.response?.status !== 401) {
        // Solo mostrar error si no es 401 (el interceptor ya maneja eso)
        alert(errorMsg);
      }
    }
  };

  const openEditTask = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleApplyFilters = () => {
    const newFilters: TaskFilters = {};
    
    if (statusFilter) newFilters.status = statusFilter as any;
    if (priorityFilter) newFilters.priority = priorityFilter as any;
    if (projectFilter) newFilters.project_id = parseInt(projectFilter);

    setFilters(newFilters);
    fetchTasks(newFilters, 1);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setProjectFilter('');
    clearFilters();
    fetchTasks({}, 1);
  };

  const handlePageChange = (page: number) => {
    fetchTasks(filters, page);
  };

  const hasActiveFilters = statusFilter || priorityFilter || projectFilter;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
            <p className="text-gray-600 mt-2">Gestiona todas tus tareas</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Tarea</span>
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={() => { clearError(); fetchTasks(); }} />
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div>
              <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                id="priorityFilter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input"
              >
                <option value="">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label htmlFor="projectFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Proyecto
              </label>
              <select
                id="projectFilter"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary flex-1"
              >
                Aplicar
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-secondary"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {statusFilter && (
                <span className="badge badge-status-pendiente">
                  Estado: {statusFilter}
                </span>
              )}
              {priorityFilter && (
                <span className="badge badge-priority-media">
                  Prioridad: {priorityFilter}
                </span>
              )}
              {projectFilter && (
                <span className="badge bg-blue-100 text-blue-800">
                  Proyecto: {projects.find(p => p.id === parseInt(projectFilter))?.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && tasks.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando tareas..." />
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? 'No se encontraron tareas' : 'No hay tareas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Comienza creando tu primera tarea'}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-primary"
              >
                Crear Tarea
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditTask}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Create Task Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nueva Tarea"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
            submitLabel="Crear Tarea"
          />
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          title="Editar Tarea"
          size="lg"
        >
          {selectedTask && (
            <TaskForm
              initialData={selectedTask}
              onSubmit={handleEditTask}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedTask(null);
              }}
              submitLabel="Actualizar Tarea"
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteConfirm && handleDeleteTask(deleteConfirm)}
                className="btn btn-danger"
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Tasks;