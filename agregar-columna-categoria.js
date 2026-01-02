const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

// Configurar conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const agregarColumnaCategoria = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...\n');

    // Agregar columna 'categoria' a la tabla 'palabras'
    const query = `
      ALTER TABLE palabras 
      ADD COLUMN IF NOT EXISTS categoria VARCHAR(100) DEFAULT 'General'
    `;

    await pool.query(query);
    
    console.log('✅ Columna Categoría agregada');
    
    // Verificar la estructura de la tabla
    const verifyQuery = `
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'palabras' AND column_name = 'categoria'
    `;
    
    const result = await pool.query(verifyQuery);
    
    if (result.rows.length > 0) {
      console.log('\n📋 Detalles de la columna:');
      console.log(`   Nombre: ${result.rows[0].column_name}`);
      console.log(`   Tipo: ${result.rows[0].data_type}`);
      console.log(`   Valor por defecto: ${result.rows[0].column_default}`);
    }

  } catch (error) {
    // Manejar error si la columna ya existe
    if (error.code === '42701') {
      console.log('ℹ️  La columna "categoria" ya existe en la tabla "palabras"');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await pool.end();
    console.log('\n🔌 Conexión cerrada');
  }
};

// Ejecutar el script
agregarColumnaCategoria();
