
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TASK_STATUS = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en progreso',
  COMPLETADA: 'completada'
} as const;

export const TASK_PRIORITY = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta'
} as const;

export const TASK_STATUS_LABELS = {
  pendiente: 'Pendiente',
  'en progreso': 'En Progreso',
  completada: 'Completada'
};

export const TASK_PRIORITY_LABELS = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  TASKS: '/tasks',
  PROFILE: '/profile'
};