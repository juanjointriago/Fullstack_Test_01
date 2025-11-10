# 🛠️ Scripts de Backend

Scripts utilitarios para gestión de base de datos y desarrollo.

---

## 📋 Scripts Disponibles

### 1. Ejecutar Seeds (Poblar Base de Datos)

Inserta datos de prueba en la base de datos.

```bash
npm run db:seed
```

**Datos insertados:**
- ✅ 8 usuarios con contraseñas hasheadas
- ✅ 8 proyectos de diferentes dominios
- ✅ 24 relaciones de colaboración
- ✅ 50+ tareas con diferentes estados

**Credenciales de prueba:**
```
Email: juan.perez@example.com
Email: maria.garcia@example.com
Email: carlos.rodriguez@example.com
Password: password123 (para todos)
```

---

### 2. Resetear Base de Datos

Limpia y vuelve a insertar todos los datos de prueba.

```bash
npm run db:reset
```

⚠️ **ADVERTENCIA:** Este comando elimina TODOS los datos existentes.

---

### 3. Generar Hash de Contraseña

Genera un hash bcrypt para una contraseña.

```bash
npm run hash
```

Útil para crear nuevos usuarios con contraseñas seguras.

---

## 📊 Estructura de Datos de Prueba

### Usuarios (8)

| ID | Nombre | Email | Rol |
|----|--------|-------|-----|
| 1 | Juan Pérez | juan.perez@example.com | Owner de 2 proyectos |
| 2 | María García | maria.garcia@example.com | Owner de 2 proyectos |
| 3 | Carlos Rodríguez | carlos.rodriguez@example.com | Owner de 2 proyectos |
| 4 | Ana Martínez | ana.martinez@example.com | Owner de 1 proyecto |
| 5 | Luis Fernández | luis.fernandez@example.com | Owner de 1 proyecto |
| 6-8 | Otros usuarios | ... | Colaboradores |

### Proyectos (8)

1. **Sistema de Gestión de Inventario** - Control de stock y reportes
2. **App Móvil de Delivery** - Geolocalización y pagos
3. **Portal de E-Learning** - Cursos online y certificados
4. **Dashboard de Analytics** - Visualización de métricas
5. **Sistema de Reservas Hoteleras** - Calendario y pagos
6. **Red Social Corporativa** - Chat y documentos
7. **API de Pagos** - Procesamiento de transacciones
8. **Sistema de Tickets de Soporte** - Gestión de incidencias

### Tareas (50+)

Cada proyecto tiene 5-7 tareas con:
- ✅ Estados: `pendiente`, `en progreso`, `completada`
- 🎯 Prioridades: `baja`, `media`, `alta`
- 👤 Asignaciones a diferentes usuarios
- 📅 Fechas de vencimiento

---

## 🔧 Uso Manual

Si prefieres ejecutar los scripts directamente:

### Ejecutar seeds.sql manualmente

```bash
# Opción 1: Desde MySQL CLI
mysql -u root -p project_manager < database/seeds.sql

# Opción 2: Desde Docker
docker exec -i mysql_container mysql -u root -ppassword project_manager < database/seeds.sql
```

### Ejecutar script TypeScript

```bash
npx tsx scripts/runSeeds.ts
```

---

## 📝 Notas Importantes

### Contraseñas

Todos los usuarios tienen la misma contraseña: **`password123`**

El hash bcrypt es: `$2b$10$Y7I7AV3OIvveE7OYi1XSk.C0.GKtrgDvptQuyGOSb46Q7dxwDl1KO`

### Variables de Entorno

Los scripts usan las variables de entorno del archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=project_manager
```

### Orden de Ejecución

1. Primero ejecuta `schema.sql` (crea las tablas)
2. Luego ejecuta `seeds.sql` (inserta datos)

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Instalar dependencias
npm install
```

### Error: "Access denied for user"

Verifica las credenciales en `.env`:
```env
DB_USER=root
DB_PASSWORD=tu_password
```

### Error: "Unknown database"

Crea la base de datos primero:
```sql
CREATE DATABASE project_manager;
```

### Error: "Foreign key constraint fails"

Ejecuta los seeds en orden:
1. Limpia las tablas (incluido en seeds.sql)
2. Inserta usuarios
3. Inserta proyectos
4. Inserta colaboradores
5. Inserta tareas

---

## 🔄 Flujo de Desarrollo

### Setup inicial

```bash
# 1. Crear base de datos
mysql -u root -p -e "CREATE DATABASE project_manager;"

# 2. Ejecutar schema
mysql -u root -p project_manager < database/schema.sql

# 3. Ejecutar seeds
npm run db:seed
```

### Reset durante desarrollo

```bash
# Limpiar y volver a poblar
npm run db:reset
```

---

## 📚 Recursos Adicionales

- [Documentación de bcrypt](https://www.npmjs.com/package/bcryptjs)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [TypeScript Node Starter](https://github.com/microsoft/TypeScript-Node-Starter)

---

**Última actualización:** 2024
