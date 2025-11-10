-- ============================================
-- SEEDS - Datos de Prueba
-- ============================================
-- Este archivo contiene datos de prueba para el sistema
-- Ejecutar después de schema.sql
-- ============================================

-- Limpiar datos existentes (en orden inverso por foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tasks;
TRUNCATE TABLE project_collaborators;
TRUNCATE TABLE projects;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- USUARIOS
-- ============================================
-- Contraseña para todos: "password123"
-- Hash generado con bcrypt (10 rounds): $2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO

INSERT INTO users (id, name, email, password) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(2, 'María García', 'maria.garcia@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(3, 'Carlos Rodríguez', 'carlos.rodriguez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(4, 'Ana Martínez', 'ana.martinez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(5, 'Luis Fernández', 'luis.fernandez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(6, 'Laura Sánchez', 'laura.sanchez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(7, 'Pedro López', 'pedro.lopez@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO'),
(8, 'Sofia Torres', 'sofia.torres@example.com', '$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO');

-- ============================================
-- PROYECTOS
-- ============================================

INSERT INTO projects (id, name, description, owner_id) VALUES
(1, 'Sistema de Gestión de Inventario', 
 'Desarrollo de un sistema completo para gestionar inventario de productos, con control de stock, alertas de reposición y reportes en tiempo real.',
 1),

(2, 'App Móvil de Delivery', 
 'Aplicación móvil para servicio de delivery de comida. Incluye geolocalización, pagos en línea y sistema de calificaciones.',
 2),

(3, 'Portal de E-Learning', 
 'Plataforma educativa online con cursos en video, evaluaciones automáticas, certificados digitales y foros de discusión.',
 1),

(4, 'Dashboard de Analytics', 
 'Dashboard interactivo para visualización de métricas de negocio con gráficos en tiempo real y exportación de reportes.',
 3),

(5, 'Sistema de Reservas Hoteleras', 
 'Plataforma para gestión de reservas de hotel con calendario de disponibilidad, pagos online y gestión de habitaciones.',
 4),

(6, 'Red Social Corporativa', 
 'Red social interna para empresas con chat, compartir documentos, eventos y directorio de empleados.',
 2),

(7, 'API de Pagos', 
 'API RESTful para procesamiento de pagos con múltiples métodos (tarjetas, transferencias, wallets digitales).',
 5),

(8, 'Sistema de Tickets de Soporte', 
 'Sistema de gestión de tickets de soporte técnico con priorización automática, asignación inteligente y SLA tracking.',
 3);

-- ============================================
-- COLABORADORES DE PROYECTOS
-- ============================================

-- Proyecto 1: Sistema de Gestión de Inventario (Owner: Juan)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(1, 2), -- María
(1, 3), -- Carlos
(1, 4); -- Ana

-- Proyecto 2: App Móvil de Delivery (Owner: María)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(2, 1), -- Juan
(2, 5), -- Luis
(2, 6); -- Laura

-- Proyecto 3: Portal de E-Learning (Owner: Juan)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(3, 2), -- María
(3, 7), -- Pedro
(3, 8); -- Sofia

-- Proyecto 4: Dashboard de Analytics (Owner: Carlos)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(4, 1), -- Juan
(4, 2), -- María
(4, 4); -- Ana

-- Proyecto 5: Sistema de Reservas Hoteleras (Owner: Ana)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(5, 3), -- Carlos
(5, 6), -- Laura
(5, 7); -- Pedro

-- Proyecto 6: Red Social Corporativa (Owner: María)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(6, 4), -- Ana
(6, 5), -- Luis
(6, 8); -- Sofia

-- Proyecto 7: API de Pagos (Owner: Luis)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(7, 1), -- Juan
(7, 3); -- Carlos

-- Proyecto 8: Sistema de Tickets (Owner: Carlos)
INSERT INTO project_collaborators (project_id, user_id) VALUES
(8, 2), -- María
(8, 6), -- Laura
(8, 7); -- Pedro

-- ============================================
-- TAREAS
-- ============================================

-- Proyecto 1: Sistema de Gestión de Inventario
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Diseñar base de datos', 'Crear diagrama ER y definir tablas para productos, categorías, movimientos de stock', 'completada', 'alta', 1, 2, 1, '2024-01-15'),
('Implementar API de productos', 'Desarrollar endpoints CRUD para gestión de productos', 'completada', 'alta', 1, 3, 1, '2024-01-20'),
('Crear dashboard de inventario', 'Diseñar e implementar interfaz principal con gráficos de stock', 'en progreso', 'alta', 1, 4, 1, '2024-02-01'),
('Sistema de alertas de stock bajo', 'Implementar notificaciones cuando productos estén por agotarse', 'pendiente', 'media', 1, 2, 1, '2024-02-10'),
('Módulo de reportes', 'Generar reportes PDF/Excel de movimientos de inventario', 'pendiente', 'media', 1, 3, 1, '2024-02-15'),
('Testing de integración', 'Escribir tests para flujos completos del sistema', 'pendiente', 'baja', 1, 4, 1, '2024-02-20');

-- Proyecto 2: App Móvil de Delivery
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Setup proyecto React Native', 'Configurar proyecto con Expo y dependencias necesarias', 'completada', 'alta', 2, 1, 2, '2024-01-10'),
('Integrar Google Maps', 'Implementar mapa con geolocalización y tracking de repartidores', 'completada', 'alta', 2, 5, 2, '2024-01-18'),
('Diseño de UI/UX', 'Crear mockups y prototipos de todas las pantallas', 'completada', 'alta', 2, 6, 2, '2024-01-22'),
('Sistema de autenticación', 'Implementar login con email, Google y Facebook', 'en progreso', 'alta', 2, 1, 2, '2024-01-30'),
('Integración de pagos', 'Conectar con Stripe para procesar pagos', 'en progreso', 'alta', 2, 5, 2, '2024-02-05'),
('Sistema de calificaciones', 'Permitir a usuarios calificar restaurantes y repartidores', 'pendiente', 'media', 2, 6, 2, '2024-02-12'),
('Push notifications', 'Implementar notificaciones para estados de pedido', 'pendiente', 'media', 2, 1, 2, '2024-02-18');

-- Proyecto 3: Portal de E-Learning
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Arquitectura del sistema', 'Definir stack tecnológico y estructura de microservicios', 'completada', 'alta', 3, 2, 1, '2024-01-12'),
('Módulo de usuarios y roles', 'Implementar sistema de roles (estudiante, profesor, admin)', 'completada', 'alta', 3, 7, 1, '2024-01-20'),
('Reproductor de video', 'Integrar video player con controles y marcadores de progreso', 'en progreso', 'alta', 3, 8, 1, '2024-02-01'),
('Sistema de evaluaciones', 'Crear módulo para quizzes con diferentes tipos de preguntas', 'en progreso', 'alta', 3, 2, 1, '2024-02-08'),
('Generador de certificados', 'Crear plantillas y sistema de generación automática de certificados', 'pendiente', 'media', 3, 7, 1, '2024-02-15'),
('Foro de discusión', 'Implementar foro con hilos, respuestas y moderación', 'pendiente', 'media', 3, 8, 1, '2024-02-22'),
('Sistema de gamificación', 'Agregar badges, puntos y rankings para motivar estudiantes', 'pendiente', 'baja', 3, 2, 1, '2024-03-01');

-- Proyecto 4: Dashboard de Analytics
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Setup de infraestructura', 'Configurar pipeline de datos con ETL', 'completada', 'alta', 4, 1, 3, '2024-01-15'),
('Gráficos de ventas', 'Implementar gráficos de línea y barras para métricas de ventas', 'completada', 'alta', 4, 2, 3, '2024-01-25'),
('Dashboard en tiempo real', 'Conectar WebSockets para actualización en vivo', 'en progreso', 'alta', 4, 4, 3, '2024-02-05'),
('Filtros avanzados', 'Agregar filtros por fecha, región, producto, etc.', 'pendiente', 'media', 4, 1, 3, '2024-02-12'),
('Exportación de reportes', 'Permitir exportar datos a PDF, Excel y CSV', 'pendiente', 'media', 4, 2, 3, '2024-02-18');

-- Proyecto 5: Sistema de Reservas Hoteleras
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Calendario de disponibilidad', 'Crear calendario interactivo con disponibilidad de habitaciones', 'completada', 'alta', 5, 3, 4, '2024-01-18'),
('Motor de búsqueda', 'Implementar búsqueda con filtros (precio, ubicación, amenidades)', 'en progreso', 'alta', 5, 6, 4, '2024-02-01'),
('Sistema de pagos', 'Integrar pasarela de pagos con múltiples métodos', 'en progreso', 'alta', 5, 7, 4, '2024-02-08'),
('Gestión de habitaciones', 'Panel admin para gestionar tipos de habitaciones y precios', 'pendiente', 'media', 5, 3, 4, '2024-02-15'),
('Sistema de reviews', 'Permitir a huéspedes dejar reseñas y calificaciones', 'pendiente', 'baja', 5, 6, 4, '2024-02-22');

-- Proyecto 6: Red Social Corporativa
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Feed de noticias', 'Implementar timeline con posts, likes y comentarios', 'completada', 'alta', 6, 4, 2, '2024-01-20'),
('Chat en tiempo real', 'Desarrollar chat 1-a-1 y grupal con Socket.io', 'en progreso', 'alta', 6, 5, 2, '2024-02-05'),
('Compartir documentos', 'Sistema para subir y compartir archivos con permisos', 'en progreso', 'media', 6, 8, 2, '2024-02-12'),
('Calendario de eventos', 'Crear calendario compartido para eventos corporativos', 'pendiente', 'media', 6, 4, 2, '2024-02-18'),
('Directorio de empleados', 'Directorio con búsqueda y perfiles de empleados', 'pendiente', 'baja', 6, 5, 2, '2024-02-25');

-- Proyecto 7: API de Pagos
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('Diseño de API REST', 'Definir endpoints, schemas y documentación OpenAPI', 'completada', 'alta', 7, 1, 5, '2024-01-15'),
('Integración con Stripe', 'Conectar con API de Stripe para tarjetas', 'completada', 'alta', 7, 3, 5, '2024-01-25'),
('Webhooks de notificación', 'Implementar webhooks para notificar estados de pago', 'en progreso', 'alta', 7, 1, 5, '2024-02-05'),
('Sistema de refunds', 'Permitir reembolsos parciales y totales', 'pendiente', 'media', 7, 3, 5, '2024-02-12'),
('Logs y auditoría', 'Registrar todas las transacciones para auditoría', 'pendiente', 'alta', 7, 1, 5, '2024-02-15');

-- Proyecto 8: Sistema de Tickets de Soporte
INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
('CRUD de tickets', 'Implementar creación, lectura, actualización de tickets', 'completada', 'alta', 8, 2, 3, '2024-01-18'),
('Sistema de priorización', 'Algoritmo para asignar prioridad automática basado en keywords', 'completada', 'alta', 8, 6, 3, '2024-01-28'),
('Asignación inteligente', 'Asignar tickets automáticamente según carga y especialidad', 'en progreso', 'alta', 8, 7, 3, '2024-02-08'),
('SLA tracking', 'Monitorear tiempos de respuesta y resolución vs SLA', 'en progreso', 'media', 8, 2, 3, '2024-02-15'),
('Base de conocimiento', 'Crear wiki con soluciones comunes para autoservicio', 'pendiente', 'media', 8, 6, 3, '2024-02-22'),
('Reportes de performance', 'Dashboard con métricas de equipo de soporte', 'pendiente', 'baja', 8, 7, 3, '2024-03-01');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Contar registros insertados
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM users
UNION ALL
SELECT 'Proyectos', COUNT(*) FROM projects
UNION ALL
SELECT 'Colaboradores', COUNT(*) FROM project_collaborators
UNION ALL
SELECT 'Tareas', COUNT(*) FROM tasks;

-- Mostrar resumen por proyecto
SELECT 
    p.name as Proyecto,
    u.name as Owner,
    COUNT(DISTINCT pc.user_id) as Colaboradores,
    COUNT(DISTINCT t.id) as Tareas,
    SUM(CASE WHEN t.status = 'completada' THEN 1 ELSE 0 END) as Completadas,
    SUM(CASE WHEN t.status = 'en progreso' THEN 1 ELSE 0 END) as 'En Progreso',
    SUM(CASE WHEN t.status = 'pendiente' THEN 1 ELSE 0 END) as Pendientes
FROM projects p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN project_collaborators pc ON p.id = pc.project_id
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name, u.name
ORDER BY p.id;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- 1. CONTRASEÑAS:
--    Todos los usuarios tienen la contraseña: "password123"
--    Para generar nuevos hashes, usar bcrypt con 10 rounds
--
-- 2. USUARIOS DE PRUEBA:
--    - juan.perez@example.com (Owner de 2 proyectos)
--    - maria.garcia@example.com (Owner de 2 proyectos)
--    - carlos.rodriguez@example.com (Owner de 2 proyectos)
--    - Resto de usuarios son colaboradores
--
-- 3. DATOS GENERADOS:
--    - 8 usuarios
--    - 8 proyectos (diferentes dominios)
--    - 24 relaciones de colaboración
--    - 50+ tareas con diferentes estados y prioridades
--
-- 4. PARA LIMPIAR Y VOLVER A EJECUTAR:
--    SET FOREIGN_KEY_CHECKS = 0;
--    TRUNCATE TABLE tasks;
--    TRUNCATE TABLE project_collaborators;
--    TRUNCATE TABLE projects;
--    TRUNCATE TABLE users;
--    SET FOREIGN_KEY_CHECKS = 1;
--
-- ============================================
