
import { useEffect, useState, type FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpiner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import Pagination from '../components/Pagination';
import { useProjectStore } from '../store/ProjectStore';

const Projects: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const {
    projects,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    clearError
  } = useProjectStore();

//   const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (name: string, description: string) => {
    try {
      await createProject(name, description);
      setIsCreateModalOpen(false);
      setSuccessMessage('Proyecto creado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.debug(err);
      // Error manejado en el store
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
      setDeleteConfirm(null);
      setSuccessMessage('Proyecto eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.debug(err)
      // Error manejado en el store
    }
  };

  const handlePageChange = (page: number) => {
    fetchProjects(page);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-gray-600 mt-2">Gestiona tus proyectos y colaboraciones</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Proyecto</span>
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
            <ErrorMessage message={error} onRetry={() => { clearError(); fetchProjects(); }} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && projects.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando proyectos..." />
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay proyectos</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer proyecto</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Crear Proyecto
            </button>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={project.is_owner ? (id) => setDeleteConfirm(id) : undefined}
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

        {/* Create Project Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nuevo Proyecto"
        >
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreateModalOpen(false)}
            submitLabel="Crear Proyecto"
          />
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
              ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer y se eliminarán todas las tareas asociadas.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteConfirm && handleDeleteProject(deleteConfirm)}
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

export default Projects;