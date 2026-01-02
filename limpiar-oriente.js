const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const limpiarYRecargar = async () => {
  try {
    console.log('🗑️  Eliminando palabras de la región Oriente (region_id = 3)...\n');
    
    const result = await pool.query('DELETE FROM palabras WHERE region_id = 3');
    console.log(`✅ Eliminadas ${result.rowCount} palabras\n`);
    
    console.log('💡 Ahora ejecuta:');
    console.log('   node scripts/seed_oriente.js');
    console.log('\nPara volver a cargar las palabras con las categorías actualizadas.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
};

limpiarYRecargar();
