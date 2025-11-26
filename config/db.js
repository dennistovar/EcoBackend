const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión con tus variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probamos la conexión al iniciar
pool.connect()
  .then(() => console.log('✅ Conectado exitosamente a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión', err.stack));

// ¡ESTA PARTE ES LA QUE FALLABA!
// Exportamos la función "query" para que el controlador la pueda usar
module.exports = {
  query: (text, params) => pool.query(text, params),
};