# 🌱 Seeds - Datos de Prueba

Base de datos poblada con datos realistas para probar el sistema.

---

## 📊 Resumen de Datos

✅ **8 usuarios** con contraseñas hasheadas  
✅ **8 proyectos** de diferentes dominios  
✅ **23 colaboradores** distribuidos en proyectos  
✅ **46 tareas** con diferentes estados y prioridades

---

## 🔑 Credenciales de Acceso

Todos los usuarios tienen la misma contraseña para facilitar las pruebas:

```
Password: password123
```

### Usuarios Principales

| Email | Nombre | Proyectos como Owner |
|-------|--------|---------------------|
| `juan.perez@example.com` | Juan Pérez | 2 proyectos |
| `maria.garcia@example.com` | María García | 2 proyectos |
| `carlos.rodriguez@example.com` | Carlos Rodríguez | 2 proyectos |
| `ana.martinez@example.com` | Ana Martínez | 1 proyecto |
| `luis.fernandez@example.com` | Luis Fernández | 1 proyecto |
| `laura.sanchez@example.com` | Laura Sánchez | Colaboradora |
| `pedro.lopez@example.com` | Pedro López | Colaborador |
| `sofia.torres@example.com` | Sofia Torres | Colaboradora |

---

## 📁 Proyectos Disponibles

### 1. Sistema de Gestión de Inventario
- **Owner:** Juan Pérez
- **Descripción:** Control de stock, alertas de reposición y reportes en tiempo real
- **Colaboradores:** María, Carlos, Ana
- **Tareas:** 6 (2 completadas, 1 en progreso, 3 pendientes)

### 2. App Móvil de Delivery
- **Owner:** María García
- **Descripción:** Geolocalización, pagos en línea y sistema de calificaciones
- **Colaboradores:** Juan, Luis, Laura
- **Tareas:** 7 (3 completadas, 2 en progreso, 2 pendientes)

### 3. Portal de E-Learning
- **Owner:** Juan Pérez
- **Descripción:** Cursos en video, evaluaciones automáticas y certificados digitales
- **Colaboradores:** María, Pedro, Sofia
- **Tareas:** 7 (2 completadas, 2 en progreso, 3 pendientes)

### 4. Dashboard de Analytics
- **Owner:** Carlos Rodríguez
- **Descripción:** Visualización de métricas con gráficos en tiempo real
- **Colaboradores:** Juan, María, Ana
- **Tareas:** 5 (2 completadas, 1 en progreso, 2 pendientes)

### 5. Sistema de Reservas Hoteleras
- **Owner:** Ana Martínez
- **Descripción:** Calendario de disponibilidad y pagos online
- **Colaboradores:** Carlos, Laura, Pedro
- **Tareas:** 5 (1 completada, 2 en progreso, 2 pendientes)

### 6. Red Social Corporativa
- **Owner:** María García
- **Descripción:** Chat, compartir documentos y directorio de empleados
- **Colaboradores:** Ana, Luis, Sofia
- **Tareas:** 5 (1 completada, 2 en progreso, 2 pendientes)

### 7. API de Pagos
- **Owner:** Luis Fernández
- **Descripción:** Procesamiento de pagos con múltiples métodos
- **Colaboradores:** Juan, Carlos
- **Tareas:** 5 (2 completadas, 1 en progreso, 2 pendientes)

### 8. Sistema de Tickets de Soporte
- **Owner:** Carlos Rodríguez
- **Descripción:** Gestión de tickets con priorización automática
- **Colaboradores:** María, Laura, Pedro
- **Tareas:** 6 (2 completadas, 2 en progreso, 2 pendientes)

---

## 📊 Estadísticas de Tareas

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Completadas | 15 | 32.6% |
| 🔄 En Progreso | 13 | 28.3% |
| ⏳ Pendientes | 18 | 39.1% |

### Por Prioridad

| Prioridad | Cantidad |
|-----------|----------|
| 🔴 Alta | ~25 tareas |
| 🟡 Media | ~15 tareas |
| 🟢 Baja | ~6 tareas |

---

## 🚀 Comandos Disponibles

### Ejecutar Seeds (Primera vez)

```bash
npm run db:setup
```

Ejecuta `schema.sql` + `seeds.sql` en orden.

### Resetear Base de Datos

```bash
npm run db:reset
```

Limpia y vuelve a insertar todos los datos.

### Verificar Datos

```bash
npm run db:verify
```

Muestra un resumen de los datos insertados.

### Generar Hash de Contraseña

```bash
npm run hash
```

Genera un hash bcrypt para nuevas contraseñas.

---

## 🧪 Casos de Prueba Sugeridos

### 1. Autenticación

```bash
POST /api/auth/login
{
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

### 2. Listar Proyectos del Usuario

```bash
GET /api/projects
Authorization: Bearer <token>
```

Debería retornar:
- 2 proyectos como owner (Juan)
- Proyectos donde es colaborador

### 3. Crear Nueva Tarea

```bash
POST /api/projects/1/tasks
{
  "title": "Nueva tarea de prueba",
  "description": "Descripción de la tarea",
  "priority": "alta",
  "assigned_to": 2
}
```

### 4. Actualizar Estado de Tarea

```bash
PUT /api/tasks/1
{
  "status": "completada"
}
```

### 5. Agregar Colaborador

```bash
POST /api/projects/1/collaborators
{
  "user_id": 5
}
```

---

## 📝 Notas Importantes

### Contraseñas

- **Texto plano:** `password123`
- **Hash bcrypt:** `$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO`
- **Salt rounds:** 10

### Relaciones

- Cada proyecto tiene 3 colaboradores (además del owner)
- Las tareas están asignadas a diferentes usuarios
- Hay tareas sin asignar (`assigned_to = NULL`)

### Fechas

- Las fechas de vencimiento están en el rango: Enero - Marzo 2024
- Puedes actualizarlas según necesites

### IDs

Los IDs son secuenciales:
- Usuarios: 1-8
- Proyectos: 1-8
- Tareas: 1-46

---

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrollo

1. **Setup inicial:**
   ```bash
   npm run db:setup
   ```

2. **Verificar datos:**
   ```bash
   npm run db:verify
   ```

3. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

4. **Probar endpoints** con las credenciales de prueba

### Para Testing

1. **Antes de cada test suite:**
   ```bash
   npm run db:reset
   ```

2. **Ejecutar tests:**
   ```bash
   npm test
   ```

---

## 🎯 Escenarios de Prueba

### Escenario 1: Usuario con Múltiples Proyectos

**Usuario:** Juan Pérez (`juan.perez@example.com`)

- Owner de 2 proyectos
- Colaborador en 3 proyectos más
- Tiene tareas asignadas en varios proyectos
- Puede crear, editar y eliminar en sus proyectos

### Escenario 2: Colaborador Simple

**Usuario:** Laura Sánchez (`laura.sanchez@example.com`)

- No es owner de ningún proyecto
- Colaboradora en 3 proyectos
- Tiene tareas asignadas
- Solo puede editar tareas asignadas a ella

### Escenario 3: Proyecto con Muchas Tareas

**Proyecto:** App Móvil de Delivery (ID: 2)

- 7 tareas con diferentes estados
- Múltiples colaboradores
- Tareas de alta prioridad
- Ideal para probar filtros y ordenamiento

---

## 🐛 Troubleshooting

### Error: "Duplicate entry"

Si ves este error, significa que los datos ya existen. Ejecuta:

```bash
npm run db:reset
```

### Error: "Foreign key constraint fails"

El orden de inserción es importante. El script `setupDatabase.ts` maneja esto automáticamente.

### Error: "Table doesn't exist"

Ejecuta primero el schema:

```bash
npm run db:setup
```

---

## 📚 Recursos

- [seeds.sql](../database/seeds.sql) - Archivo SQL con todos los datos
- [schema.sql](../database/schema.sql) - Estructura de la base de datos
- [setupDatabase.ts](./setupDatabase.ts) - Script de setup completo
- [verifyDatabase.ts](./verifyDatabase.ts) - Script de verificación

---

**Última actualización:** 2024
