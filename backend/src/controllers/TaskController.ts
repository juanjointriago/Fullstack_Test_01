
import { type Request, type Response, type NextFunction } from 'express';
import { Task, type ITaskFilters } from '../models/Task.js';
import { Project } from '../models/Project.js';
// import { User } from '../models/User.js';
import { createError } from '../middlewares/errorHandler.js';

// Obtener todas las tareas con filtros
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Construir filtros
    const filters: ITaskFilters = {};
    
    if (req.query.status) {
      filters.status = req.query.status as any;
    }
    
    if (req.query.priority) {
      filters.priority = req.query.priority as any;
    }
    
    if (req.query.project_id) {
      filters.project_id = parseInt(req.query.project_id as string);
    }
    
    if (req.query.assigned_to) {
      filters.assigned_to = parseInt(req.query.assigned_to as string);
    }
    
    if (req.query.created_by) {
      filters.created_by = parseInt(req.query.created_by as string);
    }
    
    const result = await Task.findWithFilters(filters, req.user.userId, page, limit);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea por ID
export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    if (!req.params.id) {
      throw createError('ID de tarea no proporcionado', 400);
    }
    const taskId = parseInt(req.params.id);
    
    const task = await Task.findById(taskId, req.user.userId);
    
    if (!task) {
      throw createError('Tarea no encontrada o no tienes acceso', 404);
    }
    
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva tarea
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const { title, description, status, priority, project_id, assigned_to, due_date } = req.body;
    
    // Verificar que el usuario tiene acceso al proyecto
    const hasAccess = await Project.hasAccess(project_id, req.user.userId);
    if (!hasAccess) {
      throw createError('No tienes acceso a este proyecto', 403);
    }
    
    // Si se asigna a alguien, verificar que ese usuario tiene acceso al proyecto
    if (assigned_to) {
      const assignedUserHasAccess = await Project.hasAccess(project_id, assigned_to);
      if (!assignedUserHasAccess) {
        throw createError('El usuario asignado no tiene acceso al proyecto', 400);
      }
    }
    
    const taskId = await Task.create({
      title,
      description,
      status: status || 'pendiente',
      priority: priority || 'media',
      project_id,
      assigned_to,
      created_by: req.user.userId,
      due_date
    });
    
    const task = await Task.findById(taskId, req.user.userId);
    
    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una tarea
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    if (!req.params.id) {
      throw createError('ID de tarea no proporcionado', 400);
    }
    const taskId = parseInt(req.params.id);
    const { title, description, status, priority, assigned_to, due_date } = req.body;
    
    // Verificar que la tarea existe y el usuario tiene acceso
    const existingTask = await Task.findById(taskId, req.user.userId);
    if (!existingTask) {
      throw createError('Tarea no encontrada o no tienes acceso', 404);
    }
    
    // Verificar que el usuario puede modificar la tarea
    const canModify = await Task.canModify(taskId, req.user.userId);
    if (!canModify) {
      throw createError('No tienes permisos para modificar esta tarea', 403);
    }
    
    // Si se cambia el usuario asignado, verificar que tiene acceso al proyecto
    if (assigned_to && assigned_to !== existingTask.assigned_to) {
      const assignedUserHasAccess = await Project.hasAccess(existingTask.project_id, assigned_to);
      if (!assignedUserHasAccess) {
        throw createError('El usuario asignado no tiene acceso al proyecto', 400);
      }
    }
    
    const updated = await Task.update(taskId, {
      title,
      description,
      status,
      priority,
      assigned_to,
      due_date
    });
    
    if (!updated) {
      throw createError('Error al actualizar la tarea', 500);
    }
    
    const task = await Task.findById(taskId, req.user.userId);
    
    res.status(200).json({
      message: 'Tarea actualizada exitosamente',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    if (!req.params.id) {
      throw createError('ID de tarea no proporcionado', 400);
    }
    const taskId = parseInt(req.params.id);
    
    // Verificar que la tarea existe y el usuario tiene acceso
    const existingTask = await Task.findById(taskId, req.user.userId);
    if (!existingTask) {
      throw createError('Tarea no encontrada o no tienes acceso', 404);
    }
    
    // Verificar que el usuario puede modificar la tarea
    const canModify = await Task.canModify(taskId, req.user.userId);
    if (!canModify) {
      throw createError('No tienes permisos para eliminar esta tarea', 403);
    }
    
    const deleted = await Task.delete(taskId);
    
    if (!deleted) {
      throw createError('Error al eliminar la tarea', 500);
    }
    
    res.status(200).json({
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};