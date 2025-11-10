# Frontend - React App

Este directorio contiene la implementación del frontend de la aplicación de gestión de proyectos y tareas.

## Stack Tecnológico

- **Framework**: React v19+
- **Lenguaje**: TypeScript
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Estilos**: TailwindCSS v4
- **Estado Global**: Zustand
- **HTTP Client**: Axios
- **Gráficos**: Recharts

## Características Principales

### 🎨 Componentes Avanzados

#### Autocomplete Component
Componente de autocompletado inteligente para búsqueda de usuarios:

**Ubicación**: `src/components/Autocomplete.tsx`

**Características**:
- 🔍 Búsqueda en tiempo real con debounce (300ms)
- 📝 Búsqueda por nombre o email
- 🎯 Mínimo 2 caracteres para activar la búsqueda
- ⚡ Integración con la API de búsqueda de usuarios
- 🎨 UI intuitiva con dropdown y hover states
- 🔒 Manejo de autenticación automático vía interceptores
- ❌ Manejo de errores con mensajes del backend
- 🖱️ Cierre al hacer clic fuera o presionar ESC

**Uso**:
```tsx
<Autocomplete
  value={email}
  onChange={(val) => setEmail(val)}
  onSelect={(user) => setSelectedUser(user)}
  placeholder="Buscar por nombre o email..."
/>
```

### 📊 Visualización de Datos con Recharts

**Ubicación**: `src/pages/Dashboard.tsx`

La aplicación incluye gráficos interactivos para visualización de datos:

#### 1. Gráfico de Dona - Distribución de Tareas por Estado
- Muestra la proporción de tareas: Pendiente, En Progreso, Completada
- Colores: Amarillo (Pendiente), Azul (En Progreso), Verde (Completada)
- Tooltip interactivo con valores
- Leyenda descriptiva

#### 2. Gráfico de Dona - Distribución de Tareas por Prioridad
- Visualiza la distribución: Baja, Media, Alta
- Colores: Gris (Baja), Naranja (Media), Rojo (Alta)
- Datos en tiempo real desde el backend

#### 3. Gráfico de Barras - Tareas por Proyecto
- Comparativa de tareas totales vs completadas por proyecto
- Barras agrupadas con diferentes colores
- Etiquetas rotadas para nombres largos
- Grid para mejor lectura de valores

**Características de los Gráficos**:
- ✅ Totalmente responsivos
- ✅ Interactivos con tooltips
- ✅ Actualizados en tiempo real
- ✅ Colores consistentes con el tema de la aplicación

## Librerías Utilizadas

### Build Tool
- **Vite** (recomendado): `npm create vite@latest`
- **Create React App**: `npx create-react-app --template typescript`

### Estado Global
- `zustand` - Estado global simple y eficiente

### HTTP Client
- `axios` - Cliente HTTP con interceptores

### Estilos
- `tailwindcss` v4 - Framework CSS utility-first
- CSS Modules para componentes específicos

### Visualización de Datos
- `recharts` - Librería de gráficos para React
  - Gráficos de dona (PieChart)
  - Gráficos de barras (BarChart)
  - Componentes responsivos

### Formularios y Validación
- `react-hook-form`, `formik`, `yup`, `zod`

### UI/UX
- `react-toastify`, `react-hot-toast`, `react-icons`, `framer-motion`

### Testing
- `@testing-library/react`, `vitest`, `jest`

## Instalación de Dependencias

```bash
npm install recharts
```

## Estructura de Componentes

```
src/
├── components/
│   ├── Autocomplete.tsx      # Componente de autocompletado
│   ├── NavBar.tsx
│   ├── Modal.tsx
│   └── ...
├── pages/
│   ├── Dashboard.tsx          # Con gráficos de recharts
│   ├── ProjectDetail.tsx      # Usa Autocomplete
│   └── ...
├── services/
│   └── api.ts                 # Configuración de Axios
└── store/
    └── ...
```

## Tu Implementación

Documenta tu arquitectura, decisiones técnicas y estructura en el archivo `../TECHNICAL_DECISIONS.md`.
