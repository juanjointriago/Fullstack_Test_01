
import { type Request, type Response, type NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../utils/jwt.js';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware para verificar autenticación
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token de autenticación no proporcionado' 
      });
      return;
    }
    
    // Extraer el token
    const token = authHeader.substring(7); // Remover "Bearer "
    
    // Verificar el token
    const decoded = verifyToken(token);
    
    // Agregar información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error: any) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: error.message || 'Token inválido o expirado' 
    });
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  console.debug(res);
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
};