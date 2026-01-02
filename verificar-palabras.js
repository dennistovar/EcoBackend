const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const verificarPalabras = async () => {
  try {
    console.log('🔍 Verificando palabras en la base de datos...\n');
    
    // Contar total de palabras
    const total = await pool.query('SELECT COUNT(*) FROM palabras');
    console.log(`📊 Total de palabras: ${total.rows[0].count}`);
    
    // Contar por región
    const porRegion = await pool.query(`
      SELECT region_id, COUNT(*) as cantidad 
      FROM palabras 
      GROUP BY region_id 
      ORDER BY region_id
    `);
    console.log('\n📍 Palabras por región:');
    porRegion.rows.forEach(r => {
      console.log(`   Región ${r.region_id}: ${r.cantidad} palabras`);
    });
    
    // Contar por categoría
    const porCategoria = await pool.query(`
      SELECT categoria, COUNT(*) as cantidad 
      FROM palabras 
      WHERE categoria IS NOT NULL
      GROUP BY categoria 
      ORDER BY cantidad DESC
    `);
    console.log('\n🏷️  Palabras por categoría:');
    porCategoria.rows.forEach(c => {
      console.log(`   ${c.categoria}: ${c.cantidad} palabras`);
    });
    
    // Mostrar algunas palabras de ejemplo de región 1
    const ejemplos = await pool.query(`
      SELECT palabra, region_id, categoria 
      FROM palabras 
      WHERE region_id = 1 
      LIMIT 10
    `);
    console.log('\n📝 Ejemplos de palabras (Región 1 - Costa):');
    ejemplos.rows.forEach(p => {
      console.log(`   ${p.palabra} - Categoría: ${p.categoria || 'SIN CATEGORÍA'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
};

verificarPalabras();
