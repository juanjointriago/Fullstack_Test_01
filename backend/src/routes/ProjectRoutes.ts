
import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator
} from '../controllers/ProjectController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';
import { validateRequest } from '../middlewares/errorHandler.js';
import {
  createProjectValidation,
  updateProjectValidation,
  projectIdValidation,
  addCollaboratorValidation,
  paginationValidation
} from '../utils/validators.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos del usuario
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       401:
 *         description: No autenticado
 */
router.get('/', paginationValidation, validateRequest, getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
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
 *         description: Detalles del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', projectIdValidation, validateRequest, getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 */
router.post('/', createProjectValidation, validateRequest, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Projects]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       403:
 *         description: Sin permisos
 */
router.put('/:id', updateProjectValidation, validateRequest, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
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
 *         description: Proyecto eliminado
 *       403:
 *         description: Sin permisos
 */
router.delete('/:id', projectIdValidation, validateRequest, deleteProject);

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 *   post:
 *     summary: Añadir colaborador a un proyecto
 *     tags: [Projects]
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Colaborador añadido
 *       403:
 *         description: Sin permisos
 */
router.post('/:id/collaborators', addCollaboratorValidation, validateRequest, addCollaborator);

/**
 * @swagger
 * /api/projects/{id}/collaborators/{userId}:
 *   delete:
 *     summary: Eliminar colaborador de un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Colaborador eliminado
 *       403:
 *         description: Sin permisos
 */
router.delete('/:id/collaborators/:userId', removeCollaborator);

export default router;