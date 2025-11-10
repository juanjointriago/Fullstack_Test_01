import { type FC, type KeyboardEvent, type ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';

interface UserOption {
  id: number;
  name: string;
  email: string;
}

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (user: UserOption) => void;
  placeholder?: string;
  className?: string;
}

const Autocomplete: FC<AutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!value.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/users/search?q=${encodeURIComponent(value)}`);
      setOptions(response.data.users || []);
      setIsOpen(true);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al buscar usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [value]);

  // Buscar usuarios cuando cambia el valor del input
  useEffect(() => {
    if (value.length < 2) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [value, fetchUsers]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = (user: UserOption) => {
    onChange(user.email);
    onSelect(user);
    setIsOpen(false);
    setOptions([]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && options.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />

      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {isOpen && options.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
          {options.map((user) => (
            <div
              key={user.id}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleSelect(user)}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="absolute z-10 mt-1 w-full bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;