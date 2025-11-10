
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  is_owner: boolean;
  is_collaborator: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: number;
  name: string;
  email: string;
  added_at: string;
}

export interface ProjectDetail {
  project: Project;
  collaborators: Collaborator[];
}

export interface PaginatedProjects {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  project_name: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_email?: string;
  created_by: number;
  created_by_name: string;
  created_by_email: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  assigned_to?: number;
  created_by?: number;
}

export interface DashboardStats {
  overview: {
    totalProjects: number;
    totalTasks: number;
    myTasks: number;
    createdTasks: number;
    ownedProjects: number;
    collaboratingProjects: number;
  };
  tasksByStatus: {
    pendiente: number;
    'en progreso': number;
    completada: number;
  };
  tasksByPriority: {
    baja: number;
    media: number;
    alta: number;
  };
  upcomingTasks: Task[];
  recentActivity: Task[];
}

export interface ApiError {
  error: string;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}