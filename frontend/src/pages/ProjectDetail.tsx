/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FC,type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import LoadingSpinner from "../components/LoadingSpiner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { useProjectStore } from "../store/ProjectStore";
import { useTaskStore } from "../store/TaskStore";
import { formatDate } from "../utils/formatters";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Autocomplete from "../components/Autocomplete";

const ProjectDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || "0");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] =
    useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const {
    currentProject,
    isLoading: projectLoading,
    error: projectError,
    fetchProjectById,
    updateProject,
    deleteProject,
    addCollaborator,
    removeCollaborator,
    clearCurrentProject,
    clearError: clearProjectError,
  } = useProjectStore();

  const {
    tasks,
    isLoading: tasksLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskStore();

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
      fetchTasks({ project_id: projectId });
    }

    return () => {
      clearCurrentProject();
    };
  }, [projectId, fetchProjectById, fetchTasks, clearCurrentProject]);

  const handleUpdateProject = async (name: string, description: string) => {
    try {
      await updateProject(projectId, name, description);
      setIsEditModalOpen(false);
      setSuccessMessage("Proyecto actualizado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.debug(err);
      // Error manejado en el store
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      navigate("/projects");
    } catch (err) {
      console.debug(err);

      // Error manejado en el store
    }
  };

  const handleAddCollaborator = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Por favor seleccione un usuario de la lista");
      return;
    }

    try {
      // Usamos la acción del store para añadir colaborador
      if (typeof addCollaborator === "function") {
        await addCollaborator(projectId, selectedUser.id);
      }
      // Refrescamos el proyecto para obtener la lista actualizada de colaboradores
      await fetchProjectById(projectId);
      setSuccessMessage("Colaborador añadido exitosamente");
      setCollaboratorEmail("");
      setSelectedUser(null);
      setError("");
      setIsAddCollaboratorModalOpen(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || "Error al añadir colaborador";
      setError(errorMessage);
    }
  };

  const handleRemoveCollaborator = async (userId: number) => {
    try {
      await removeCollaborator(projectId, userId);
      setSuccessMessage("Colaborador eliminado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.debug(err);

      // Error manejado en el store
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask({ ...taskData, project_id: projectId });
      setIsCreateTaskModalOpen(false);
      setSuccessMessage("Tarea creada exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.debug(err);

      // Error manejado en el store
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditTask = async (taskData: any) => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, taskData);
      setIsEditTaskModalOpen(false);
      setSelectedTask(null);
      setSuccessMessage("Tarea actualizada exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.debug(err);

      // Error manejado en el store
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setDeleteConfirm(null);
      setSuccessMessage("Tarea eliminada exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.debug(err);

      // Error manejado en el store
    }
  };

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await updateTask(taskId, { status });
      setSuccessMessage("Estado actualizado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error al actualizar estado:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Error al actualizar el estado de la tarea";

      // Mostrar el error en lugar de solo hacer console.debug
      if (err.response?.status === 403) {
        alert("No tienes permisos para modificar esta tarea");
      } else if (err.response?.status !== 401) {
        // Solo mostrar error si no es 401 (el interceptor ya maneja eso)
        alert(errorMsg);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditTask = (task: any) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  if (projectLoading && !currentProject) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" text="Cargando proyecto..." />
        </div>
      </>
    );
  }

  if (projectError) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message={projectError}
            onRetry={() => {
              clearProjectError();
              fetchProjectById(projectId);
            }}
          />
        </div>
      </>
    );
  }

  if (!currentProject) {
    return null;
  }

  const { project, collaborators } = currentProject;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/projects" className="text-blue-600 hover:text-blue-800">
            Proyectos
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{project.name}</span>
        </nav>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          </div>
        )}

        {/* Project Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-gray-600">{project.description}</p>
              )}
            </div>
            {project.is_owner && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-secondary"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleteConfirm(-1)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Propietario</p>
              <p className="font-medium text-gray-900">{project.owner_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Creado</p>
              <p className="font-medium text-gray-900">
                {formatDate(project.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Colaboradores</p>
              <p className="font-medium text-gray-900">
                {collaborators.length}
              </p>
            </div>
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Colaboradores
            </h2>
            {project.is_owner && (
              <button
                onClick={() => setIsAddCollaboratorModalOpen(true)}
                className="btn btn-primary text-sm"
              >
                Añadir Colaborador
              </button>
            )}
          </div>

          {collaborators.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No hay colaboradores en este proyecto
            </p>
          ) : (
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {collaborator.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>
                  {project.is_owner && (
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Tareas del Proyecto
            </h2>
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Nueva Tarea</span>
            </button>
          </div>

          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" text="Cargando tareas..." />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay tareas
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando la primera tarea del proyecto
              </p>
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="btn btn-primary"
              >
                Crear Tarea
              </button>
            </div>
          ) : (
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
          )}
        </div>

        {/* Edit Project Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Proyecto"
        >
          <ProjectForm
            initialData={{
              name: project.name,
              description: project.description || "",
            }}
            onSubmit={handleUpdateProject}
            onCancel={() => setIsEditModalOpen(false)}
            submitLabel="Actualizar Proyecto"
          />
        </Modal>

        {/* Add Collaborator Modal */}
        <Modal
          isOpen={isAddCollaboratorModalOpen}
          onClose={() => setIsAddCollaboratorModalOpen(false)}
          title="Añadir Colaborador"
          size="sm"
        >
          <form onSubmit={handleAddCollaborator} className="space-y-4">
            <div>
              <label
                htmlFor="collaboratorEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email del colaborador
              </label>
              <Autocomplete
                value={collaboratorEmail}
                onChange={(val) => {
                  setCollaboratorEmail(val);
                  setSelectedUser(null);
                  setError("");
                }}
                onSelect={(user) => {
                  setCollaboratorEmail(user.email);
                  setSelectedUser(user);
                  setError("");
                }}
                placeholder="Buscar por nombre o email..."
                className="input"
              />
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddCollaboratorModalOpen(false);
                  setSelectedUser(null);
                  setCollaboratorEmail("");
                  setError("");
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Añadir
              </button>
            </div>
          </form>
        </Modal>

        {/* Create Task Modal */}
        <Modal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          title="Crear Nueva Tarea"
          size="lg"
        >
          <TaskForm
            projectId={projectId}
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateTaskModalOpen(false)}
            submitLabel="Crear Tarea"
          />
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditTaskModalOpen}
          onClose={() => {
            setIsEditTaskModalOpen(false);
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
                setIsEditTaskModalOpen(false);
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
              {deleteConfirm === -1
                ? "¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer y se eliminarán todas las tareas asociadas."
                : "¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  deleteConfirm === -1
                    ? handleDeleteProject()
                    : handleDeleteTask(deleteConfirm!)
                }
                className="btn btn-danger"
                disabled={projectLoading || tasksLoading}
              >
                {projectLoading || tasksLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProjectDetail;
