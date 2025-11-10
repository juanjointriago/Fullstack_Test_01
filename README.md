# Prueba Técnica - Fullstack Developer (Node.js + React)

¡Bienvenido(a) a la prueba técnica para el puesto de **Desarrollador Fullstack**!

Esta prueba evaluará tus habilidades en el desarrollo de aplicaciones full-stack modernas utilizando **Node.js**, **Express**, **React**, y bases de datos. Tendrás **48 horas** para completar el desafío.

---

## 📋 Descripción del Proyecto

Desarrollarás una **plataforma de gestión de proyectos y tareas colaborativa** donde los usuarios pueden:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar proyectos
- Asignar tareas a diferentes proyectos
- Colaborar con otros usuarios en proyectos compartidos
- Filtrar, buscar y ordenar tareas por diferentes criterios
- Ver estadísticas básicas de sus proyectos

---

## 🛠️ Stack Tecnológico Requerido

### Backend
- **Runtime**: Node.js (v24 o superior)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL **o** MongoDB (elige una)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: React (v19 o superior)
- **Lenguaje**: TypeScript
- **Routing**: React Router v7
- **Estilos**: TailwindCSS (preferencia)

### DevOps (Opcional)
- **Containerización**: Docker + Docker Compose

**Nota**: Puedes usar cualquier otra librería o herramienta que consideres necesaria. Documenta tus decisiones técnicas en el archivo `TECHNICAL_DECISIONS.md`.

---

## 📦 Funcionalidades Requeridas

### 1. Autenticación y Usuarios

**Backend:**
- Registro de usuarios con validación
- Login con generación de JWT
- Middleware de autenticación para proteger rutas
- Hash de contraseñas
- Endpoint para obtener perfil del usuario autenticado

**Frontend:**
- Formularios de registro y login con validaciones
- Almacenamiento del token de autenticación
- Rutas protegidas que requieren autenticación
- Redirección automática según estado de autenticación

---

### 2. Gestión de Proyectos

**Backend:**
- CRUD completo de proyectos
- Solo el creador del proyecto puede editarlo o eliminarlo
- Sistema de colaboradores: añadir usuarios a proyectos
- Paginación en listado de proyectos

**Frontend:**
- Lista de proyectos con diseño responsive
- Crear, editar y eliminar proyectos
- Búsqueda y filtrado de proyectos
- Gestión de colaboradores

---

### 3. Gestión de Tareas

**Backend:**
- CRUD completo de tareas
- Las tareas pertenecen a un proyecto
- Estados: "pendiente", "en progreso", "completada"
- Prioridades: "baja", "media", "alta"
- Asignar tareas a colaboradores del proyecto
- Filtros por estado, prioridad, proyecto, usuario asignado
- Ordenamiento flexible

**Frontend:**
- Visualización de tareas (lista, kanban, o tu propuesta)
- Crear, editar y eliminar tareas
- Cambiar estado de tareas
- Filtros interactivos
- Asignación de tareas a usuarios

---

### 4. Dashboard y Estadísticas

**Backend:**
- Endpoint con estadísticas del usuario:
  - Total de proyectos
  - Total de tareas
  - Tareas por estado
  - Otras métricas relevantes

**Frontend:**
- Dashboard con visualización de estadísticas
- Resumen de actividad del usuario

---

## 📊 Criterios de Evaluación

Tu proyecto será evaluado en base a:

| Criterio | Peso |
|----------|------|
| **Funcionalidad** | 30% |
| **Calidad del Código** | 25% |
| **Arquitectura y Diseño** | 15% |
| **Seguridad** | 10% |
| **UI/UX** | 10% |
| **Documentación** | 5% |
| **Testing** | 5% |

### Puntos Extra (hasta +30%)
- Docker implementation completa (+10%)
- Tests exhaustivos (+5%)
- Funcionalidades adicionales (+5%)
- CI/CD pipeline (+5%)
- Deploy en producción (+5%)

---

## 📝 Instrucciones de Entrega

1. **Fork del repositorio**: Crea un fork de este repositorio

2. **Rama de trabajo**:
   ```
   test/tu-nombre-completo
   ```

3. **Estructura del proyecto**:
   ```
   /
   ├── backend/
   ├── frontend/
   ├── TECHNICAL_DECISIONS.md    # Documenta tus decisiones aquí
   ├── docker-compose.yml         # (opcional)
   └── README.md                  # Actualiza con instrucciones de ejecución
   ```

4. **Documentación requerida**:
   - Actualiza este README con instrucciones de instalación y ejecución
   - Completa el archivo `TECHNICAL_DECISIONS.md` explicando tus elecciones
   - Documenta tu API con Swagger
   - Incluye al menos 5 tests

5. **Pull Request**: Una vez completado, crea un PR hacia el repositorio original

---

## ⏱️ Tiempo

Tienes **48 horas** desde que recibes esta prueba. Gestiona tu tiempo según tus prioridades.

---

## ❓ Preguntas Frecuentes

**¿Puedo usar librerías adicionales?**
Sí, documenta tus elecciones en `TECHNICAL_DECISIONS.md`.

**¿Qué base de datos uso?**
La que prefieras (MySQL o MongoDB). No afecta la evaluación.

**¿Es obligatorio Docker?**
No, pero suma puntos extra.

**¿Puedo usar librerías de UI?**
Sí. Recomendamos TailwindCSS para estilos, pero también puedes usar otras librerías de componentes (Material-UI, Ant Design, etc.).

---

## 🎉 ¡Buena suerte!

Recuerda: evaluamos no solo que funcione, sino **cómo está construido**. Demuestra tu criterio técnico y mejores prácticas.

Si tienes dudas sobre los requisitos, no dudes en contactarnos.

---

# 📖 Instrucciones de Ejecución

## Prerrequisitos

Asegúrate de tener instalado:
- **Docker** (v20.10 o superior)
- **Docker Compose** (v2.0 o superior)
- **Node.js** (v24 o superior) - solo si ejecutas sin Docker
- **MySQL** (v8.0 o superior) - solo si ejecutas sin Docker

## Instalación y Ejecución con Docker (Recomendado)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Fullstack_Test_01
```

### 2. Configurar variables de entorno

**Backend** - Crear archivo `backend/.env`:
```env
PORT=3000
DB_HOST=mysql
DB_USER=fullstack_user
DB_PASSWORD=fullstack_pass
DB_NAME=fullstack_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
```

**Frontend** - Crear archivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar todos los servicios
```bash
docker-compose up -d
```

Este comando iniciará:
- **MySQL** en puerto 3306
- **Backend** en puerto 3000
- **Frontend** en puerto 5173

### 4. Inicializar la base de datos
```bash
docker exec -i fullstack_test_01-mysql-1 mysql -ufullstack_user -pfullstack_pass fullstack_db < backend/database/schema.sql
```

### 5. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs

### 6. Detener los servicios
```bash
docker-compose down
```

Para eliminar también los volúmenes:
```bash
docker-compose down -v
```

---

## Instalación y Ejecución sin Docker

### Backend

1. **Navegar al directorio del backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno** (crear archivo `.env`):
```env
PORT=3000
DB_HOST=localhost
DB_USER=fullstack_user
DB_PASSWORD=fullstack_pass
DB_NAME=fullstack_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
```

4. **Crear la base de datos**:
```bash
mysql -u root -p < database/schema.sql
```

5. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

6. **Compilar para producción**:
```bash
npm run build
npm start
```

### Frontend

1. **Navegar al directorio del frontend**:
```bash
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno** (crear archivo `.env`):
```env
VITE_API_URL=http://localhost:3000
```

4. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

5. **Compilar para producción**:
```bash
npm run build
npm run preview
```

---

## Tests

### Backend Tests
```bash
cd backend
npm test
```

Para ejecutar tests con cobertura:
```bash
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## API Documentation

La documentación completa de la API está disponible en Swagger:
- **URL**: http://localhost:3000/api-docs
- **Formato**: OpenAPI 3.0

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado

#### Proyectos
- `GET /api/projects` - Listar proyectos (con paginación)
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto por ID
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto
- `POST /api/projects/:id/collaborators` - Añadir colaborador

#### Tareas
- `GET /api/tasks` - Listar tareas (con filtros)
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks/:id` - Obtener tarea por ID
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

#### Dashboard
- `GET /api/dashboard` - Obtener estadísticas del usuario

---

## Credenciales de Prueba

Puedes crear un usuario de prueba usando el endpoint de registro, o usar estas credenciales si ya están creadas:

```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

---

## Estructura del Proyecto

```
Fullstack_Test_01/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración (DB, Swagger)
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middlewares/     # Middlewares (auth, errors)
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── utils/           # Utilidades (JWT, validators)
│   │   ├── app.ts           # Configuración de Express
│   │   └── index.ts         # Punto de entrada
│   ├── database/
│   │   └── schema.sql       # Esquema de base de datos
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios API
│   │   ├── store/           # Zustand stores (Auth, etc.)
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilidades
│   │   ├── App.tsx          # Componente principal
│   │   └── main.tsx         # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── README.md
└── TECHNICAL_DECISIONS.md
```

---

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo: `docker ps`
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que el esquema esté inicializado

### Puerto ya en uso
Si algún puerto está ocupado, puedes cambiarlos en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Cambiar puerto del backend
  - "5174:5173"  # Cambiar puerto del frontend
```

### Problemas con CORS
Verifica que `VITE_API_URL` en el frontend apunte correctamente al backend.

---

## Tecnologías Utilizadas

### Backend
- Node.js 24 + Express 5.1.0 + TypeScript 5.9.3
- MySQL 8.0 con prepared statements (mysql2 3.15.3)
- JWT para autenticación (jsonwebtoken 9.0.2)
- bcryptjs 3.0.3 para hash de contraseñas
- express-validator 7.3.0 para validaciones
- Swagger (swagger-jsdoc 6.2.8 + swagger-ui-express 5.0.1)
- helmet 8.1.0 para seguridad
- morgan 1.10.1 para logging

### Frontend
- React 19 + TypeScript
- Vite como build tool
- React Router v6 para navegación
- TailwindCSS para estilos
- Context API para estado global
- Axios para peticiones HTTP

### DevOps
- Docker + Docker Compose
- Multi-stage builds para optimización
- Volúmenes persistentes para MySQL

---

## Contacto

Para cualquier duda o consulta sobre el proyecto, no dudes en contactar.
