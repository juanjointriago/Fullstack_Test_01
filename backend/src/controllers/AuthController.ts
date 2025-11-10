
import { type Request, type Response, type NextFunction } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { createError } from '../middlewares/errorHandler.js';

// Registro de usuario
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }
    
    // Crear usuario
    const userId = await User.create({ name, email, password });
    
    // Obtener datos del usuario creado
    const user = await User.findById(userId);
    
    if (!user) {
      throw createError('Error al crear el usuario', 500);
    }
    
    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuario
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await User.findByEmail(email);
    if (!user) {
      throw createError('Credenciales inválidas', 401);
    }
    
    // Verificar contraseña
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw createError('Credenciales inválidas', 401);
    }
    
    // Generar token
    const token = generateToken({ userId: user.id!, email: user.email });
    
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      throw createError('Usuario no encontrado', 404);
    }
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};