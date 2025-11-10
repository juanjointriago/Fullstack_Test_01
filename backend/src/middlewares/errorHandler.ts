import { type Request, type Response, type NextFunction } from 'express';
import { validationResult, type ValidationError } from 'express-validator';

// Interfaz para errores personalizados
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Middleware de manejo de errores centralizado
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error para debugging
  console.debug(next);
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Determinar el código de estado
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Error interno del servidor',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    }
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.url}`
    }
  });
};

// Helper para crear errores personalizados
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Middleware para validar resultados de express-validator
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Los datos proporcionados no son válidos',
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg
      }))
    });
    return;
  }

  next();
};