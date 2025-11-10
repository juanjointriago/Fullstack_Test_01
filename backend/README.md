# Backend - API REST

API RESTful para gestión de proyectos y tareas construida con Node.js, Express y TypeScript.

---

## 🚀 Stack Tecnológico

- **Runtime**: Node.js v24.x
- **Framework**: Express.js v5.1.0
- **Lenguaje**: TypeScript v5.9.3
- **Base de Datos**: MySQL v8.0
- **Autenticación**: JWT (jsonwebtoken)
- **Documentación**: Swagger/OpenAPI

---

## 📦 Dependencias Principales

### Base de Datos
- `mysql2` v3.15.3 - Cliente MySQL con soporte para Promises

### Seguridad
- `bcryptjs` v3.0.3 - Hashing de contraseñas
- `helmet` v8.1.0 - Headers de seguridad HTTP
- `cors` v2.8.5 - Cross-Origin Resource Sharing
- `jsonwebtoken` v9.0.2 - Autenticación JWT

### Validación
- `express-validator` v7.3.0 - Validación de requests

### Documentación
- `swagger-jsdoc` v6.2.8 - Generación de docs OpenAPI
- `swagger-ui-express` v5.0.1 - UI interactiva de Swagger

### Utilidades
- `dotenv` v17.2.3 - Variables de entorno
- `morgan` v1.10.1 - Logger HTTP

---

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, Swagger)
│   ├── controllers/     # Controladores de rutas
│   ├── middlewares/     # Middlewares (auth, errors, validation)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades (response, validation)
│   └── index.ts         # Punto de entrada
├── database/
│   ├── schema.sql       # Esquema de base de datos
│   ├── seeds.sql        # Datos de prueba
│   └── SEEDS_README.md  # Documentación de seeds
├── scripts/
│   ├── setupDatabase.ts    # Setup completo de DB
│   ├── runSeeds.ts         # Ejecutar solo seeds
│   ├── verifyDatabase.ts   # Verificar datos
│   ├── generateHash.ts     # Generar hash bcrypt
│   └── README.md           # Documentación de scripts
├── .env                 # Variables de entorno
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=project_manager

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE project_manager;"

# Ejecutar schema y seeds
npm run db:setup
```

---

## 🚀 Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Iniciar servidor en producción
npm start
```

### Base de Datos

```bash
# Setup completo (schema + seeds)
npm run db:setup

# Ejecutar solo seeds
npm run db:seed

# Resetear base de datos
npm run db:reset

# Verificar datos insertados
npm run db:verify
```

### Utilidades

```bash
# Generar hash bcrypt para contraseñas
npm run hash
```

---

## 🌱 Datos de Prueba (Seeds)

El sistema incluye datos de prueba realistas para facilitar el desarrollo y testing.

### Credenciales de Acceso

```
Email: juan.perez@example.com
Email: maria.garcia@example.com
Email: carlos.rodriguez@example.com
Password: password123 (para todos)
```

### Datos Insertados

- ✅ **8 usuarios** con contraseñas hasheadas
- ✅ **8 proyectos** de diferentes dominios
- ✅ **23 colaboradores** distribuidos en proyectos
- ✅ **46 tareas** con diferentes estados y prioridades

📚 **Documentación completa:** [database/SEEDS_README.md](./database/SEEDS_README.md)

---

## 📡 API Endpoints

### Autenticación

```bash
POST   /api/auth/register    # Registrar nuevo usuario
POST   /api/auth/login        # Iniciar sesión
GET    /api/auth/me           # Obtener usuario actual
```

### Proyectos

```bash
GET    /api/projects          # Listar proyectos del usuario
POST   /api/projects          # Crear nuevo proyecto
GET    /api/projects/:id      # Obtener proyecto por ID
PUT    /api/projects/:id      # Actualizar proyecto
DELETE /api/projects/:id      # Eliminar proyecto
```

### Colaboradores

```bash
GET    /api/projects/:id/collaborators       # Listar colaboradores
POST   /api/projects/:id/collaborators       # Agregar colaborador
DELETE /api/projects/:id/collaborators/:uid  # Eliminar colaborador
```

### Usuarios

```bash
GET    /api/users/search?q=query              # Buscar usuarios por nombre o email
```

**Características del endpoint de búsqueda**:
- 🔍 Búsqueda por nombre o email con patrón LIKE
- 📊 Límite de 10 resultados
- 🔒 Requiere autenticación (token JWT)
- ⚡ Mínimo 2 caracteres para realizar la búsqueda
- 📝 Retorna: `id`, `name`, `email`

**Ejemplo de uso**:
```bash
curl -X GET "http://localhost:3000/api/users/search?q=juan" \
  -H "Authorization: Bearer <token>"

# Respuesta:
{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan.perez@example.com"
    },
    {
      "id": 2,
      "name": "Juana García",
      "email": "juana.garcia@example.com"
    }
  ]
}
```

### Tareas

```bash
GET    /api/projects/:id/tasks    # Listar tareas del proyecto
POST   /api/projects/:id/tasks    # Crear nueva tarea
GET    /api/tasks/:id             # Obtener tarea por ID
PUT    /api/tasks/:id             # Actualizar tarea
DELETE /api/tasks/:id             # Eliminar tarea
```

### Documentación

```bash
GET    /api-docs                  # Swagger UI interactiva
GET    /api-docs.json             # Especificación OpenAPI JSON
```

---

## 🔒 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. **Registro/Login:** El usuario envía credenciales
2. **Token:** El servidor retorna un JWT
3. **Requests:** El cliente incluye el token en el header:
   ```
   Authorization: Bearer <token>
   ```

### Ejemplo

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@example.com","password":"password123"}'

# Respuesta:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "name": "Juan Pérez", "email": "..." }
  }
}

# 2. Usar token en requests
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📚 Documentación API (Swagger)

Una vez iniciado el servidor, accede a:

```
http://localhost:3000/api-docs
```

La documentación interactiva te permite:
- ✅ Ver todos los endpoints disponibles
- ✅ Probar requests directamente desde el navegador
- ✅ Ver schemas de request/response
- ✅ Autenticarte con JWT

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 🐳 Docker

### Desarrollo con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down
```

### Build manual

```bash
# Build imagen
docker build -t project-manager-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env project-manager-backend
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MySQL"

Verifica que MySQL esté corriendo y las credenciales en `.env` sean correctas:

```bash
mysql -u root -p -e "SELECT 1;"
```

### Error: "Table doesn't exist"

Ejecuta el setup de base de datos:

```bash
npm run db:setup
```

### Error: "Port 3000 already in use"

Cambia el puerto en `.env`:

```env
PORT=3001
```

### Error: "JWT secret not defined"

Asegúrate de tener `JWT_SECRET` en tu `.env`:

```env
JWT_SECRET=your_super_secret_key
```

---

## 📖 Documentación Adicional

- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Decisiones técnicas del backend
- [database/SEEDS_README.md](./database/SEEDS_README.md) - Documentación de seeds
- [scripts/README.md](./scripts/README.md) - Documentación de scripts

---

## 🚀 Despliegue

### Variables de Entorno en Producción

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secure-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Consideraciones

- ✅ Usa variables de entorno seguras
- ✅ Habilita HTTPS
- ✅ Configura rate limiting
- ✅ Implementa logging robusto
- ✅ Monitorea errores (Sentry, etc.)
- ✅ Usa un proceso manager (PM2, etc.)

---

## 📝 Licencia

ISC

---

**Última actualización:** 2024

## Tu Implementación

Documenta tu arquitectura, decisiones técnicas y estructura en el archivo `../TECHNICAL_DECISIONS.md`.
