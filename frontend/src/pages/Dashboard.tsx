
import { useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Navbar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpiner';
import ErrorMessage from '../components/ErrorMessage';
import { useDashboardStore } from '../store/DashboardStore';
import { formatDate } from '../utils/formatters';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants';

const Dashboard: FC = () => {
  const { stats, isLoading, error, fetchStats, clearError } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" text="Cargando estadísticas..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={() => { clearError(); fetchStats(); }} />
        </div>
      </>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen de tus proyectos y tareas</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/projects"
            className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Crear Proyecto</h3>
                <p className="text-sm text-gray-600">Inicia un nuevo proyecto</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tasks"
            className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Crear Tarea</h3>
                <p className="text-sm text-gray-600">Añade una nueva tarea</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Proyectos</p>
                <p className="text-3xl font-bold mt-2">{stats.overview.totalProjects}</p>
              </div>
              <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span>Propios: {stats.overview.ownedProjects}</span>
              <span>Colaborando: {stats.overview.collaboratingProjects}</span>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Tareas</p>
                <p className="text-3xl font-bold mt-2">{stats.overview.totalTasks}</p>
              </div>
              <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span>Asignadas: {stats.overview.myTasks}</span>
              <span>Creadas: {stats.overview.createdTasks}</span>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tareas Completadas</p>
                <p className="text-3xl font-bold mt-2">{stats.tasksByStatus.completada}</p>
              </div>
              <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-4 text-sm">
              {stats.overview.totalTasks > 0 && (
                <span>
                  {Math.round((stats.tasksByStatus.completada / stats.overview.totalTasks) * 100)}% del total
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut Chart - Tasks by Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución de Tareas por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pendiente', value: stats.tasksByStatus.pendiente, color: '#eab308' },
                    { name: 'En Progreso', value: stats.tasksByStatus['en progreso'], color: '#3b82f6' },
                    { name: 'Completada', value: stats.tasksByStatus.completada, color: '#22c55e' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {[
                    { name: 'Pendiente', value: stats.tasksByStatus.pendiente, color: '#eab308' },
                    { name: 'En Progreso', value: stats.tasksByStatus['en progreso'], color: '#3b82f6' },
                    { name: 'Completada', value: stats.tasksByStatus.completada, color: '#22c55e' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart - Tasks by Priority */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución de Tareas por Prioridad</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Baja', value: stats.tasksByPriority.baja, color: '#6b7280' },
                    { name: 'Media', value: stats.tasksByPriority.media, color: '#f97316' },
                    { name: 'Alta', value: stats.tasksByPriority.alta, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {[
                    { name: 'Baja', value: stats.tasksByPriority.baja, color: '#6b7280' },
                    { name: 'Media', value: stats.tasksByPriority.media, color: '#f97316' },
                    { name: 'Alta', value: stats.tasksByPriority.alta, color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Tasks per Project */}
        {stats.topProjects && stats.topProjects.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tareas por Proyecto</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stats.topProjects.map(project => ({
                  name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
                  tareas: project.task_count,
                  completadas: project.completed_tasks || 0
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: '12px' }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tareas" fill="#3b82f6" name="Total Tareas" />
                <Bar dataKey="completadas" fill="#22c55e" name="Completadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Original Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks by Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tareas por Estado</h2>
            <div className="space-y-3">
              {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS]}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'pendiente' ? 'bg-yellow-500' :
                        status === 'en progreso' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{
                        width: stats.overview.totalTasks > 0
                          ? `${(count / stats.overview.totalTasks) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks by Priority */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tareas por Prioridad</h2>
            <div className="space-y-3">
              {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {TASK_PRIORITY_LABELS[priority as keyof typeof TASK_PRIORITY_LABELS]}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'baja' ? 'bg-gray-500' :
                        priority === 'media' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{
                        width: stats.overview.totalTasks > 0
                          ? `${(count / stats.overview.totalTasks) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        {stats.upcomingTasks.length > 0 && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tareas Próximas a Vencer</h2>
              <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todas →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.project_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      Vence: {formatDate(task.due_date!)}
                    </p>
                    <span className={`badge badge-priority-${task.priority} text-xs`}>
                      {TASK_PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
              <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todas →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentActivity.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    task.status === 'completada' ? 'bg-green-100' :
                    task.status === 'en progreso' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    <svg className={`w-4 h-4 ${
                      task.status === 'completada' ? 'text-green-600' :
                      task.status === 'en progreso' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.project_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`badge badge-status-${task.status.replace(' ', '-')} text-xs`}>
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      <span className="text-xs text-gray-500">
                        Actualizado por {task.updated_by_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;