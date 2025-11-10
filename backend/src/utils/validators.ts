
import { body, param, query, type ValidationChain } from 'express-validator';

// Validadores de autenticación
export const registerValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];

// Validadores de proyectos
export const createProjectValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del proyecto es requerido')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

export const updateProjectValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de proyecto inválido'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
];

export const projectIdValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de proyecto inválido')
];

export const addCollaboratorValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de proyecto inválido'),
  body('userId')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido')
];

// Validadores de tareas
export const createTaskValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es requerido')
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  body('status')
    .optional()
    .isIn(['pendiente', 'en progreso', 'completada']).withMessage('Estado inválido'),
  body('priority')
    .optional()
    .isIn(['baja', 'media', 'alta']).withMessage('Prioridad inválida'),
  body('project_id')
    .isInt({ min: 1 }).withMessage('ID de proyecto inválido'),
  body('assigned_to')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de usuario asignado inválido'),
  body('due_date')
    .optional()
    .isISO8601().withMessage('Fecha inválida (formato: YYYY-MM-DD)')
];

export const updateTaskValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de tarea inválido'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  body('status')
    .optional()
    .isIn(['pendiente', 'en progreso', 'completada']).withMessage('Estado inválido'),
  body('priority')
    .optional()
    .isIn(['baja', 'media', 'alta']).withMessage('Prioridad inválida'),
  body('assigned_to')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de usuario asignado inválido'),
  body('due_date')
    .optional()
    .isISO8601().withMessage('Fecha inválida (formato: YYYY-MM-DD)')
];

export const taskIdValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de tarea inválido')
];

// Validadores de query params
export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100')
];

export const taskFiltersValidation: ValidationChain[] = [
  query('status')
    .optional()
    .isIn(['pendiente', 'en progreso', 'completada']).withMessage('Estado inválido'),
  query('priority')
    .optional()
    .isIn(['baja', 'media', 'alta']).withMessage('Prioridad inválida'),
  query('project_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de proyecto inválido'),
  query('assigned_to')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),
  query('created_by')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de usuario inválido')
];