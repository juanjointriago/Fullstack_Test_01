import { Router } from 'express';
import { searchUsers } from '../controllers/UserController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = Router();

// Todas las rutas aquí requieren autenticación
router.use(authenticate);

// Ruta para buscar usuarios por nombre o email
router.get('/search', searchUsers);

export default router;
