
import { type Request, type Response, type NextFunction } from 'express';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { createError } from '../middlewares/errorHandler.js';

//TODO add validation for req.params.id not undefined
// Obtener todos los proyectos del usuario
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await Project.findByUser(req.user.userId, page, limit);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    if (!req.params.id) {
      throw createError('ID del proyecto no proporcionado', 400);
    }
    const projectId = parseInt(req.params.id);
    
    const project = await Project.findById(projectId, req.user.userId);
    
    if (!project) {
      throw createError('Proyecto no encontrado', 404);
    }
    
    // Verificar acceso
    if (!project.is_owner && !project.is_collaborator) {
      throw createError('No tienes acceso a este proyecto', 403);
    }
    
    // Obtener colaboradores
    const collaborators = await Project.getCollaborators(projectId);
    
    res.status(200).json({
      project,
      collaborators
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const { name, description } = req.body;
    
    const projectId = await Project.create({
      name,
      description,
      owner_id: req.user.userId
    });
    
    const project = await Project.findById(projectId, req.user.userId);
    
    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      project
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un proyecto
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    if (!req.params.id) {
      throw createError('ID del proyecto no proporcionado', 400);
    }
    const projectId = parseInt(req.params.id);
    const { name, description } = req.body;
    
    // Verificar que el usuario es el owner
    const isOwner = await Project.isOwner(projectId, req.user.userId);
    if (!isOwner) {
      throw createError('Solo el propietario puede editar el proyecto', 403);
    }
    
    const updated = await Project.update(projectId, { name, description });
    
    if (!updated) {
      throw createError('Proyecto no encontrado', 404);
    }
    
    const project = await Project.findById(projectId, req.user.userId);
    
    res.status(200).json({
      message: 'Proyecto actualizado exitosamente',
      project
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un proyecto
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    if (!req.params.id) {
      throw createError('ID del proyecto no proporcionado', 400);
    }
    const projectId = parseInt(req.params.id);
    
    // Verificar que el usuario es el owner
    const isOwner = await Project.isOwner(projectId, req.user.userId);
    if (!isOwner) {
      throw createError('Solo el propietario puede eliminar el proyecto', 403);
    }
    
    const deleted = await Project.delete(projectId);
    
    if (!deleted) {
      throw createError('Proyecto no encontrado', 404);
    }
    
    res.status(200).json({
      message: 'Proyecto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Añadir colaborador a un proyecto
export const addCollaborator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    if (!req.params.id) {
      throw createError('ID del proyecto no proporcionado', 400);
    }
    const projectId = parseInt(req.params.id);
    const { userId } = req.body;
    
    // Verificar que el usuario es el owner
    const isOwner = await Project.isOwner(projectId, req.user.userId);
    if (!isOwner) {
      throw createError('Solo el propietario puede añadir colaboradores', 403);
    }
    
    // Verificar que el usuario a añadir existe
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      throw createError('Usuario no encontrado', 404);
    }
    
    // Verificar que no es el owner
    if (userId === req.user.userId) {
      throw createError('No puedes añadirte como colaborador', 400);
    }
    
    // Añadir colaborador
    const added = await Project.addCollaborator(projectId, userId);
    
    if (!added) {
      throw createError('El usuario ya es colaborador del proyecto', 409);
    }
    
    res.status(200).json({
      message: 'Colaborador añadido exitosamente',
      collaborator: {
        id: userToAdd.id,
        name: userToAdd.name,
        email: userToAdd.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar colaborador de un proyecto
export const removeCollaborator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    if (!req.params.id) {
      throw createError('ID del proyecto no proporcionado', 400);
    }
    if (!req.params.userId) {
      throw createError('ID del usuario no proporcionado', 400);
    }
    const projectId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    
    // Verificar que el usuario es el owner
    const isOwner = await Project.isOwner(projectId, req.user.userId);
    if (!isOwner) {
      throw createError('Solo el propietario puede eliminar colaboradores', 403);
    }
    
    const removed = await Project.removeCollaborator(projectId, userId);
    
    if (!removed) {
      throw createError('Colaborador no encontrado', 404);
    }
    
    res.status(200).json({
      message: 'Colaborador eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};