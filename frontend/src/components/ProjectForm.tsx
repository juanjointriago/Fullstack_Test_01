
import { useState, type FC, type FormEvent } from 'react';

interface ProjectFormProps {
  initialData?: {
    name: string;
    description: string;
  };
  onSubmit: (name: string, description: string) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const ProjectForm: FC<ProjectFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Crear Proyecto'
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }

    if (name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), description.trim());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el proyecto');
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Proyecto *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Ej: Desarrollo de aplicación web"
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
          rows={4}
          placeholder="Describe el proyecto..."
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/1000 caracteres
        </p>
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

export default ProjectForm;