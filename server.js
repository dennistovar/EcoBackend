// ==========================================
// CONFIGURACIÓN INICIAL - Variables de Entorno
// ==========================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
const app = express();

// ==========================================
// CONEXIÓN A BASE DE DATOS
// ==========================================
require('./config/db');

// ==========================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ==========================================
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==========================================
// CONFIGURACIÓN DE CORS (Dinámico)
// ==========================================
// En producción, FRONTEND_URL debe estar definido en .env
// En desarrollo, usa el valor por defecto (localhost:5173)
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true, //  CRÍTICO: Permite envío de cookies y headers Authorization
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Validación en producción
if (NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.warn('  WARNING: FRONTEND_URL no está definida en producción. CORS usará valor por defecto.');
}

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones en desarrollo
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==========================================
// IMPORTACIÓN DE RUTAS
// ==========================================
const wordRoutes = require('./routes/wordRoutes');
const authRoutes = require('./routes/authRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ==========================================
// REGISTRO DE RUTAS - API v1
// ==========================================
app.use('/api/words', wordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// RUTA RAÍZ - Health Check
// ==========================================
app.get('/', (req, res) => {
  res.json({
    message: 'API del Backend EcoLéxico funcionando correctamente 🚀',
    version: '2.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      words: '/api/words',
      favorites: '/api/favorites',
      admin: '/api/admin'
    }
  });
});

// ==========================================
// RUTA DE INFORMACIÓN DEL SERVIDOR
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    environment: NODE_ENV,
    cors: {
      allowedOrigin: FRONTEND_URL
    }
  });
});

// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// ==========================================
// MANEJO GLOBAL DE ERRORES
// ==========================================
app.use((err, req, res, next) => {
  console.error(' Error no manejado:', err.stack);
  res.status(err.status || 500).json({
    error: NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('═══════════════════════════════════════════════');
  console.log(` Servidor EcoLéxico iniciado exitosamente`);
  console.log(` Puerto: ${PORT}`);
  console.log(` Ambiente: ${NODE_ENV}`);
  console.log(` CORS habilitado para: ${FRONTEND_URL}`);
  console.log(` Timestamp: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════');
});
