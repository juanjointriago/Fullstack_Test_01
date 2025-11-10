import { type Request, type Response, type NextFunction } from 'express';
import { User } from '../models/User.js';
import { createError } from '../middlewares/errorHandler.js';

export const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Usuario no autenticado', 401);
    }

    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      res.status(200).json({ users: [] });
      return;
    }

    const users = await User.searchByEmailOrName(query.trim());
    
    res.status(200).json({ 
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      }))
    });
  } catch (error) {
    next(error);
  }
};
