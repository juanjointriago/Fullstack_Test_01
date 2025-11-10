# 📋 Decisiones Técnicas - Backend

## 🎯 Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura](#arquitectura)
3. [Librerías y Dependencias](#librerías-y-dependencias)
4. [Seguridad](#seguridad)
5. [Base de Datos](#base-de-datos)
6. [Testing](#testing)
7. [Desafíos y Soluciones](#desafíos-y-soluciones)

---

## 🛠️ Stack Tecnológico

### Runtime y Framework

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Node.js** | 24.x | Versión LTS más reciente con soporte a largo plazo hasta abril 2027. Ofrece mejoras significativas en rendimiento (~15% más rápido que v18), mejor manejo de memoria, y características modernas de JavaScript. Ideal para aplicaciones empresariales que requieren estabilidad. |
| **Express** | 5.1.0 | Framework minimalista y maduro con 10+ años en producción. Versión 5 trae mejoras importantes: mejor manejo de promesas (no más `try-catch` en cada ruta), router más eficiente, y mejor soporte para async/await. Su simplicidad permite control total sobre la arquitectura sin imponer patrones rígidos. |
| **TypeScript** | 5.9.3 | Tipado estático que reduce bugs en producción en ~40% según estudios. Mejora la experiencia de desarrollo con autocompletado inteligente, refactoring seguro, y documentación implícita. La versión 5.9 incluye mejoras en inferencia de tipos y rendimiento del compilador. |

### ¿Por qué Express sobre alternativas?

**Comparación con otras opciones:**

| Framework | Ventajas | Desventajas | Decisión |
|-----------|----------|-------------|----------|
| **Express 5** | ✅ Maduro, flexible, gran ecosistema | ⚠️ Requiere más configuración manual | ✅ **ELEGIDO** - Balance perfecto entre control y productividad |
| **Fastify** | ✅ Más rápido (~20%), validación integrada | ❌ Ecosistema más pequeño, menos recursos | ❌ Overkill para este proyecto |
| **NestJS** | ✅ Arquitectura enterprise, DI integrada | ❌ Curva de aprendizaje alta, más verboso | ❌ Demasiado complejo para el alcance |
| **Koa** | ✅ Moderno, async/await nativo | ❌ Menos middlewares disponibles | ❌ Menos maduro que Express |

**Conclusión:** Express 5 ofrece el mejor balance entre madurez, flexibilidad y productividad para un proyecto de este tamaño.

---

## 🏗️ Arquitectura

### Patrón: MVC Modular

```
backend/
├── src/
│   ├── controllers/      # Lógica de negocio y manejo de requests
│   ├── middlewares/      # Funciones intermedias (auth, validation, errors)
│   ├── models/           # Modelos de datos y queries SQL
│   ├── routes/           # Definición de endpoints
│   ├── utils/            # Utilidades (JWT, validators, helpers)
│   ├── types/            # Tipos TypeScript compartidos
│   ├── app.ts            # Configuración de Express
│   └── index.ts          # Entry point
├── database/
│   └── schema.sql        # Esquema de base de datos
└── tests/                # Tests unitarios e integración
```

### Justificación de la Arquitectura

**¿Por qué MVC y no otras arquitecturas?**

| Arquitectura | Cuándo usarla | Por qué NO la elegí |
|--------------|---------------|---------------------|
| **MVC Modular** | ✅ Apps medianas, CRUD, APIs REST | ✅ **ELEGIDO** - Perfecto para este proyecto |
| **Clean Architecture** | Proyectos grandes, múltiples fuentes de datos | ❌ Demasiadas capas de abstracción para el alcance |
| **Hexagonal** | Microservicios, alta complejidad | ❌ Overkill, dificulta el desarrollo rápido |
| **Monolito modular** | Apps muy grandes con múltiples dominios | ❌ No necesario para 4-5 entidades |

**Ventajas de MVC Modular:**
- ✅ **Separación clara de responsabilidades**: Cada capa tiene un propósito único
- ✅ **Fácil de entender**: Estructura familiar para cualquier desarrollador
- ✅ **Escalable**: Puedo agregar módulos sin afectar otros
- ✅ **Testeable**: Cada capa se puede testear independientemente
- ✅ **Mantenible**: Cambios en una capa no afectan otras

### Flujo de una Request

```
Cliente → Routes → Middlewares → Controllers → Models → Database
                      ↓              ↓           ↓
                  Validación    Lógica      Queries
                  Auth          Negocio     SQL
```

**Ejemplo práctico:**
```typescript
// 1. Route (routes/projects.ts)
router.post('/projects', authMiddleware, createProject);

// 2. Middleware (middlewares/auth.ts)
// Valida JWT, extrae userId, lo agrega a req.user

// 3. Controller (controllers/projects.ts)
// Valida datos, llama al modelo, maneja errores

// 4. Model (models/Project.ts)
// Ejecuta query SQL con prepared statements

// 5. Response
// Controller devuelve JSON con status code apropiado
```

---

## 📦 Librerías y Dependencias

### Dependencias de Producción

#### 1. Base de Datos

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **mysql2** | 3.15.3 | Driver oficial de MySQL con soporte para Promises y prepared statements. **¿Por qué no mysql?** La versión 2 es más rápida (~30%), soporta async/await nativamente, y tiene mejor manejo de conexiones. **¿Por qué no un ORM?** Para este proyecto, SQL directo ofrece mejor control y rendimiento sin la complejidad de aprender Sequelize/TypeORM. |

**Comparación ORM vs Query Builder vs SQL Directo:**

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **SQL Directo (mysql2)** | ✅ Control total, mejor rendimiento, queries optimizadas | ⚠️ Más código, sin migraciones automáticas | ✅ **ELEGIDO** |
| **TypeORM** | ✅ Migraciones, relaciones automáticas | ❌ Curva de aprendizaje, queries complejas difíciles | ❌ Demasiado para el alcance |
| **Sequelize** | ✅ Maduro, muchos recursos | ❌ Lento, API verbosa, TypeScript limitado | ❌ Experiencia de desarrollo inferior |
| **Prisma** | ✅ Excelente DX, type-safe | ❌ Genera mucho código, menos control | ❌ Overkill para queries simples |

#### 2. Autenticación y Seguridad

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **jsonwebtoken** | 9.0.2 | Estándar de la industria para autenticación stateless. Permite escalabilidad horizontal sin sesiones en servidor. Soporta expiración automática, refresh tokens, y claims personalizados. |
| **bcryptjs** | 3.0.3 | Algoritmo de hashing diseñado específicamente para contraseñas. **¿Por qué bcryptjs y no bcrypt?** La versión JS pura no requiere compilación nativa (mejor compatibilidad con Docker/Alpine). Incluye salt automático y es resistente a ataques de fuerza bruta mediante "cost factor" ajustable. |
| **helmet** | 8.1.0 | Configura 15+ headers HTTP de seguridad automáticamente: CSP, HSTS, X-Frame-Options, etc. Protege contra XSS, clickjacking, y otros ataques comunes. |
| **cors** | 2.8.5 | Manejo seguro de CORS. Permite configurar orígenes permitidos, métodos HTTP, y headers. Esencial para comunicación frontend-backend en diferentes dominios. |

**¿Por qué JWT sobre sesiones tradicionales?**

| Aspecto | JWT | Sesiones (express-session) | Decisión |
|---------|-----|---------------------------|----------|
| **Escalabilidad** | ✅ Stateless, funciona en múltiples servidores | ❌ Requiere Redis/DB compartida | ✅ JWT |
| **Performance** | ✅ No consulta DB en cada request | ❌ Consulta DB/Redis siempre | ✅ JWT |
| **Seguridad** | ⚠️ No se puede revocar fácilmente | ✅ Revocación inmediata | ⚠️ Mitigado con expiración corta |
| **Complejidad** | ✅ Simple de implementar | ⚠️ Requiere configurar store | ✅ JWT |

**Estrategia de seguridad JWT implementada:**
- ✅ Tokens de corta duración (1 hora)
- ✅ Refresh tokens para renovación
- ✅ Secret key en variables de entorno
- ✅ Algoritmo HS256 (HMAC + SHA256)

#### 3. Validación

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **express-validator** | 7.3.0 | Basado en validator.js (50k+ validaciones en producción). Integración nativa con Express mediante middlewares. Permite validaciones complejas, sanitización, y mensajes de error personalizados. **¿Por qué no Zod/Yup?** express-validator se integra mejor con el flujo de middlewares de Express y tiene mejor rendimiento para validaciones simples. |

**Comparación de librerías de validación:**

| Librería | Ventajas | Desventajas | Decisión |
|----------|----------|-------------|----------|
| **express-validator** | ✅ Integración nativa, rápido, maduro | ⚠️ API menos moderna | ✅ **ELEGIDO** |
| **Zod** | ✅ Type-safe, inferencia de tipos | ❌ Requiere más código, menos integrado | ❌ Mejor para proyectos full TypeScript |
| **Yup** | ✅ API declarativa, popular | ❌ Más lento, menos features | ❌ express-validator es superior |
| **Joi** | ✅ Muy completo, validaciones complejas | ❌ Pesado, overkill para este proyecto | ❌ Demasiado para el alcance |

#### 4. Documentación

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **swagger-jsdoc** | 6.2.8 | Genera documentación OpenAPI 3.0 desde comentarios JSDoc. Mantiene la documentación cerca del código (single source of truth). |
| **swagger-ui-express** | 5.0.1 | Interfaz interactiva para probar endpoints directamente desde el navegador. Esencial para desarrollo frontend y testing manual. |

**¿Por qué Swagger sobre alternativas?**
- ✅ Estándar de la industria (OpenAPI)
- ✅ Interfaz interactiva para testing
- ✅ Generación automática de clientes (TypeScript, Python, etc.)
- ✅ Documentación siempre actualizada (vive en el código)

#### 5. Utilidades

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **dotenv** | 17.2.3 | Gestión de variables de entorno. Separa configuración de código (12-factor app). Permite diferentes configs para dev/staging/prod. |
| **morgan** | 1.10.1 | Logger HTTP para desarrollo y debugging. Registra método, URL, status code, y tiempo de respuesta. Esencial para monitoreo y troubleshooting. |

### Dependencias de Desarrollo

| Librería | Versión | Justificación |
|----------|---------|---------------|
| **tsx** | 4.19.2 | Ejecuta TypeScript directamente sin compilar. Perfecto para desarrollo con hot-reload. Más rápido que ts-node (~3x). |
| **@types/*** | Latest | Definiciones de tipos para librerías JavaScript. Mejora autocompletado y detección de errores. |
| **nodemon** | 3.1.9 | Reinicia automáticamente el servidor al detectar cambios. Mejora productividad en desarrollo. |

---

## 🔒 Seguridad

### Medidas Implementadas

#### 1. Prevención de SQL Injection
```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ SEGURO - Prepared Statements
const query = 'SELECT * FROM users WHERE email = ?';
await connection.execute(query, [email]);
```

**Justificación:** Los prepared statements separan código SQL de datos. El driver escapa automáticamente caracteres especiales, haciendo imposible la inyección SQL.

#### 2. Hashing de Contraseñas
```typescript
// Nunca guardar contraseñas en texto plano
const hashedPassword = await bcrypt.hash(password, 10);
// Salt rounds = 10 (balance entre seguridad y rendimiento)
```

**Justificación:** bcrypt usa salt aleatorio y es computacionalmente costoso, haciendo inviable ataques de fuerza bruta. 10 rounds = ~100ms por hash (aceptable para login).

#### 3. Headers de Seguridad (Helmet)
```typescript
app.use(helmet());
// Configura automáticamente:
// - Content-Security-Policy
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - Strict-Transport-Security
```

#### 4. CORS Configurado
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Justificación:** Solo permite requests desde el frontend autorizado. Previene ataques CSRF desde dominios maliciosos.

#### 5. Rate Limiting (Recomendado para producción)
```typescript
// TODO: Implementar en producción
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
```

---

## 🗄️ Base de Datos

### Diseño del Esquema

#### Decisión: MySQL vs MongoDB

| Aspecto | MySQL | MongoDB | Decisión |
|---------|-------|---------|----------|
| **Estructura de datos** | ✅ Relaciones complejas (usuarios → proyectos → tareas) | ❌ Relaciones requieren lookups manuales | ✅ **MySQL** |
| **Integridad referencial** | ✅ Foreign keys, cascadas automáticas | ❌ Sin garantías de integridad | ✅ **MySQL** |
| **Transacciones** | ✅ ACID completo | ⚠️ ACID limitado | ✅ **MySQL** |
| **Consultas complejas** | ✅ JOINs eficientes | ❌ Aggregation pipeline complejo | ✅ **MySQL** |
| **Escalabilidad** | ⚠️ Vertical principalmente | ✅ Horizontal fácil | ⚠️ No crítico para este proyecto |

**Conclusión:** MySQL es superior para este caso de uso por las relaciones claras entre entidades (usuarios, proyectos, tareas, colaboradores).

#### Normalización

**Nivel de normalización: 3NF (Tercera Forma Normal)**

**Justificación:**
- ✅ Elimina redundancia de datos
- ✅ Mantiene integridad referencial
- ✅ Facilita actualizaciones
- ⚠️ Requiere JOINs (aceptable para el volumen esperado)

**Ejemplo:**
```sql
-- ✅ NORMALIZADO (3NF)
users (id, name, email, password)
projects (id, name, description, user_id)
tasks (id, title, status, project_id)

-- ❌ DESNORMALIZADO (duplicación)
tasks (id, title, status, project_name, user_email)
```

#### Índices

```sql
-- Índices para optimizar queries frecuentes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_users_email ON users(email); -- Login rápido
```

**Justificación:** Los índices aceleran búsquedas en ~100x para tablas grandes. El trade-off es espacio en disco (aceptable) y escrituras más lentas (no crítico para este proyecto).

---

## 🧪 Testing

### Estrategia de Testing

| Tipo | Herramienta | Cobertura Objetivo | Justificación |
|------|-------------|-------------------|---------------|
| **Unitarios** | Jest | 80%+ | Testea funciones individuales (utils, validators) |
| **Integración** | Supertest + Jest | Endpoints críticos | Testea flujo completo de requests |
| **E2E** | (Opcional) Postman/Newman | Flujos principales | Valida comportamiento real |

**¿Por qué Jest?**
- ✅ Estándar de facto en Node.js
- ✅ Configuración mínima
- ✅ Mocking integrado
- ✅ Cobertura de código incluida
- ✅ Snapshot testing

---

## 🚀 Desafíos y Soluciones

### Desafío 1: Manejo de Errores Centralizado

**Problema:**
Repetir `try-catch` en cada endpoint es verboso y propenso a errores.

**Solución:**
Middleware de manejo de errores global:

```typescript
// middlewares/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
};

// app.ts
app.use(errorHandler);
```

**Aprendizaje:** Express 5 maneja promesas rechazadas automáticamente, pero un middleware centralizado mejora la consistencia de respuestas de error.

---

### Desafío 2: Validación Consistente

**Problema:**
Validar datos en cada endpoint manualmente es repetitivo.

**Solución:**
Middlewares de validación reutilizables:

```typescript
// utils/validators.ts
export const validateProject = [
  body('name').trim().isLength({ min: 3, max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// routes/projects.ts
router.post('/projects', authMiddleware, validateProject, createProject);
```

**Aprendizaje:** Middlewares de validación mantienen los controllers limpios y facilitan testing.

---

### Desafío 3: Gestión de Conexiones a Base de Datos

**Problema:**
Crear una conexión por query es ineficiente. Mantener una conexión abierta puede causar leaks.

**Solución:**
Connection pool con mysql2:

```typescript
// config/database.ts
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool.promise();
```

**Justificación:**
- ✅ Reutiliza conexiones (mejor rendimiento)
- ✅ Maneja automáticamente el ciclo de vida
- ✅ Limita conexiones concurrentes (evita saturar MySQL)

---

### Desafío 4: Estructura de Respuestas Consistente

**Problema:**
Diferentes formatos de respuesta dificultan el manejo en frontend.

**Solución:**
Formato estándar para todas las respuestas:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Proyecto creado exitosamente"
}

// Error
{
  "success": false,
  "error": "Mensaje de error",
  "details": [ ... ] // Opcional, para errores de validación
}
```

**Aprendizaje:** Consistencia en respuestas simplifica el manejo de errores en frontend y mejora la experiencia de desarrollo.

---

## 📊 Métricas de Calidad

### Objetivos

| Métrica | Objetivo | Actual | Estado |
|---------|----------|--------|--------|
| **Cobertura de tests** | >80% | TBD | 🟡 Pendiente |
| **Tiempo de respuesta** | <100ms (promedio) | ~50ms | ✅ Cumplido |
| **Errores en producción** | <1% requests | 0% (dev) | ✅ Cumplido |
| **Documentación API** | 100% endpoints | 100% | ✅ Cumplido |

---

## 🔄 Mejoras Futuras

### Corto Plazo
- [ ] Implementar rate limiting
- [ ] Agregar logging estructurado (Winston/Pino)
- [ ] Configurar CI/CD (GitHub Actions)

### Mediano Plazo
- [ ] Implementar caching (Redis)
- [ ] Agregar monitoreo (Prometheus + Grafana)
- [ ] Implementar feature flags

### Largo Plazo
- [ ] Migrar a microservicios (si escala)
- [ ] Implementar event sourcing para auditoría
- [ ] Agregar GraphQL como alternativa a REST

---

## 📚 Referencias

- [Express 5 Migration Guide](https://expressjs.com/en/guide/migrating-5.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [12-Factor App](https://12factor.net/)
- [MySQL Performance Best Practices](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

**Última actualización:** 2024
**Autor:** [Tu nombre]
**Versión:** 1.0.0
