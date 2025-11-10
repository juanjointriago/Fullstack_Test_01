import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Importar rutas (incluye UserRoutes)
import authRoutes from './routes/AuthRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
import taskRoutes from './routes/TaskRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import userRoutes from './routes/UserRoutes.js';

const app: Express = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Configurar Swagger
setupSwagger(app);

// Rutas de la API
// Registrar UserRoutes en app.ts
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Ruta para usuarios importada desde UserRoutes
app.use('/api/users', userRoutes);

// Middleware para rutas no encontradas (404)
app.use((_req: Request, _res: Response, next: NextFunction) => {
  //solo ignora el favicono al consultarse desde el navegador
  if (_req.originalUrl === '/favicon.ico') {
    return _res.status(204).end();
  }
  const error = new Error('Not Found') as any;
  error.status = 404;
  next(error);
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;