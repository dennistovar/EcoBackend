# EcoLéxico Backend

Backend API para la aplicación EcoLéxico - Diccionario de palabras ecuatorianas por regiones.

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecolexico_db
DB_PASSWORD=tu_contraseña
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt_aqui
```

**Nota:** Reemplaza los valores con tus propias credenciales.

### 4. Configurar la base de datos

#### 4.1 Crear la base de datos

```sql
CREATE DATABASE ecolexico_db;
```

#### 4.2 Crear las tablas necesarias

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    clave_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de palabras
CREATE TABLE palabras (
    id SERIAL PRIMARY KEY,
    palabra VARCHAR(255) NOT NULL,
    significado TEXT NOT NULL,
    ejemplo TEXT,
    pronunciacion VARCHAR(255),
    audio_url VARCHAR(500),
    region_id INTEGER,
    provincia_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de favoritos
CREATE TABLE usuario_favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    palabra_id INTEGER REFERENCES palabras(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, palabra_id)
);
```

### 5. Crear usuario administrador (Opcional)

Ejecuta el script para crear un usuario admin:

```bash
node createAdmin.js
```

O ejecuta manualmente en PostgreSQL:

```sql
-- Inserta un usuario admin con contraseña hasheada
-- La contraseña 'admin123' debe ser hasheada con bcrypt antes de insertarla
```

## ▶️ Ejecutar el proyecto

### Modo desarrollo (con nodemon)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor se iniciará en `http://localhost:5000`

## 📚 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Palabras

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/words` | Obtener todas las palabras |
| POST | `/api/words` | Crear nueva palabra |
| PUT | `/api/words/:id` | Actualizar palabra |
| DELETE | `/api/words/:id` | Eliminar palabra |

### Favoritos (requiere autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/favorites` | Obtener favoritos del usuario |
| POST | `/api/favorites` | Agregar palabra a favoritos |
| DELETE | `/api/favorites/:word_id` | Eliminar palabra de favoritos |

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 📦 Estructura del proyecto

```
Backend/
├── config/
│   └── db.js              # Configuración de PostgreSQL
├── controllers/
│   ├── authController.js  # Lógica de autenticación
│   └── wordController.js  # Lógica de palabras
├── middleware/
│   ├── authMiddleware.js       # Verificación de JWT
│   └── favoritesController.js  # Lógica de favoritos
├── routes/
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── wordRoutes.js      # Rutas de palabras
│   └── favoritesRoutes.js # Rutas de favoritos
├── .env                   # Variables de entorno (no subir a git)
├── server.js              # Punto de entrada
└── package.json           # Dependencias
```

## 🧪 Scripts útiles

```bash
# Verificar usuario admin
node verifyAdmin.js

# Crear usuario admin
node createAdmin.js

# Probar login
node testLogin.js
```

## 🛠️ Solución de problemas

### Error de conexión a PostgreSQL

Verifica que:
- PostgreSQL esté corriendo
- Las credenciales en `.env` sean correctas
- La base de datos exista

### Error "Cannot find module"

Ejecuta:
```bash
npm install
```

### Error de autenticación

Verifica que:
- El token JWT sea válido
- La variable `JWT_SECRET` esté configurada en `.env`
- El token se envíe en el header `Authorization`

## 👨‍💻 Autor

EcoLéxico - Ecuador 🇪🇨

## 📄 Licencia

ISC
