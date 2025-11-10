
import { Router } from 'express';
import { getDashboardStats } from '../controllers/DashboardController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                 tasksByStatus:
 *                   type: object
 *                 tasksByPriority:
 *                   type: object
 *                 upcomingTasks:
 *                   type: array
 *                 recentActivity:
 *                   type: array
 */
router.get('/', authenticate, getDashboardStats);

export default router;