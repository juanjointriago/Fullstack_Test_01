
import { type Request, type Response, type NextFunction } from 'express';
import { type RowDataPacket } from 'mysql2';
import pool from '../config/db.js';
import { createError } from '../middlewares/errorHandler.js';

// Obtener estadísticas del dashboard
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const userId = req.user.userId;
    
    // Total de proyectos (como owner o colaborador)
    const [projectsCount] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM projects p
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId]
    );
    
    // Total de tareas
    const [tasksCount] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT t.id) as total
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId]
    );
    
    // Tareas por estado
    const [tasksByStatus] = await pool.execute<RowDataPacket[]>(
      `SELECT t.status, COUNT(*) as count
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?
       GROUP BY t.status`,
      [userId, userId]
    );
    
    // Tareas por prioridad
    const [tasksByPriority] = await pool.execute<RowDataPacket[]>(
      `SELECT t.priority, COUNT(*) as count
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?
       GROUP BY t.priority`,
      [userId, userId]
    );
    
    // Tareas asignadas al usuario
    const [myTasks] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM tasks t
       WHERE t.assigned_to = ?`,
      [userId]
    );
    
    // Tareas creadas por el usuario
    const [createdTasks] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM tasks t
       WHERE t.created_by = ?`,
      [userId]
    );
    
    // Proyectos donde es owner
    const [ownedProjects] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM projects p
       WHERE p.owner_id = ?`,
      [userId]
    );
    
    // Proyectos donde es colaborador
    const [collaboratingProjects] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM project_collaborators pc
       WHERE pc.user_id = ?`,
      [userId]
    );
    
    // Tareas próximas a vencer (próximos 7 días)
    const [upcomingTasks] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, p.name as project_name
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE (p.owner_id = ? OR pc.user_id = ? OR t.assigned_to = ?)
       AND t.status != 'completada'
       AND t.due_date IS NOT NULL
       AND t.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY t.due_date ASC
       LIMIT 5`,
      [userId, userId, userId]
    );
    
    // Actividad reciente (últimas 10 tareas creadas o actualizadas)
    const [recentActivity] = await pool.execute<RowDataPacket[]>(
      `SELECT t.id, t.title, t.status, t.updated_at, p.name as project_name,
              u.name as updated_by_name
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       INNER JOIN users u ON t.created_by = u.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?
       ORDER BY t.updated_at DESC
       LIMIT 10`,
      [userId, userId]
    );

    if(!projectsCount[0]){
        throw createError('No se encontraron proyectos para el usuario', 404);
    }
    if (!tasksCount[0]) {
        throw createError('No se encontraron tareas para el usuario', 404);
    }
    if (!myTasks[0] || !createdTasks[0] || !ownedProjects[0] || !collaboratingProjects[0]) {
        throw createError('No se encontraron datos suficientes para el usuario', 404);
    }
    
    // Formatear respuesta
    const stats = {
      overview: {
        totalProjects: projectsCount[0].total,
        totalTasks: tasksCount[0].total,
        myTasks: myTasks[0].total,
        createdTasks: createdTasks[0].total,
        ownedProjects: ownedProjects[0].total,
        collaboratingProjects: collaboratingProjects[0].total
      },
      tasksByStatus: {
        pendiente: 0,
        'en progreso': 0,
        completada: 0
      },
      tasksByPriority: {
        baja: 0,
        media: 0,
        alta: 0
      },
      upcomingTasks: upcomingTasks,
      recentActivity: recentActivity
    };
    
    // Llenar tareas por estado
    tasksByStatus.forEach((row: any) => {
      stats.tasksByStatus[row.status as keyof typeof stats.tasksByStatus] = row.count;
    });
    
    // Llenar tareas por prioridad
    tasksByPriority.forEach((row: any) => {
      stats.tasksByPriority[row.priority as keyof typeof stats.tasksByPriority] = row.count;
    });
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};