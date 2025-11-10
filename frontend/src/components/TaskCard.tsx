
import { type Task } from '../types';
import { formatDate, truncateText } from '../utils/formatters';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants';
import type { FC } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'pendiente': 'badge-status-pendiente',
      'en progreso': 'badge-status-en-progreso',
      'completada': 'badge-status-completada'
    };
    return classes[status as keyof typeof classes] || 'badge-status-pendiente';
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      'baja': 'badge-priority-baja',
      'media': 'badge-priority-media',
      'alta': 'badge-priority-alta'
    };
    return classes[priority as keyof typeof classes] || 'badge-priority-media';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Editar tarea"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Eliminar tarea"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-3 text-sm">
          {truncateText(task.description, 150)}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {TASK_STATUS_LABELS[task.status]}
        </span>
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span>{task.project_name}</span>
        </div>

        {task.assigned_to_name && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Asignado a: {task.assigned_to_name}</span>
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Vence: {formatDate(task.due_date)}</span>
          </div>
        )}
      </div>

      {onStatusChange && (
        <div className="mt-4 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cambiar estado:
          </label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="input text-sm"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;