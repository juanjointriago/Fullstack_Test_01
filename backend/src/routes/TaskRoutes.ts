
import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/TaskController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';
import { validateRequest } from '../middlewares/errorHandler.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  paginationValidation,
  taskFiltersValidation
} from '../utils/validators.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas con filtros
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, en progreso, completada]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: assigned_to
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', [...paginationValidation, ...taskFiltersValidation], validateRequest, getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 */
router.get('/:id', taskIdValidation, validateRequest, getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - project_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pendiente, en progreso, completada]
 *               priority:
 *                 type: string
 *                 enum: [baja, media, alta]
 *               project_id:
 *                 type: integer
 *               assigned_to:
 *                 type: integer
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tarea creada
 */
router.post('/', createTaskValidation, validateRequest, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               assigned_to:
 *                 type: integer
 *               due_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
router.put('/:id', updateTaskValidation, validateRequest, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
router.delete('/:id', taskIdValidation, validateRequest, deleteTask);

export default router;