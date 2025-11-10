
import { Link } from 'react-router-dom';
import { type Project } from '../types';
import { formatDate } from '../utils/formatters';
import type { FC } from 'react';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: number) => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, onDelete }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/projects/${project.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {project.name}
          </Link>
          {project.is_owner && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Propietario
            </span>
          )}
          {project.is_collaborator && !project.is_owner && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Colaborador
            </span>
          )}
        </div>
        
        {project.is_owner && onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Eliminar proyecto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {project.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{project.owner_name}</span>
        </div>
        <span>{formatDate(project.created_at)}</span>
      </div>
    </div>
  );
};

export default ProjectCard;