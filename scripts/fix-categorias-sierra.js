const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const fixCategories = async () => {
  console.log('🔧 Corrigiendo categorías de la Sierra...\n');
  
  const updates = [
    { palabra: 'Aniñado', categoria: 'Expressions' },
    { palabra: 'Bacán', categoria: 'Expressions' },
    { palabra: 'Arrarray', categoria: 'Expressions' },
    { palabra: 'Chompa', categoria: 'Expressions' },
    { palabra: 'Desgreñado', categoria: 'Expressions' },
    { palabra: 'Macanudo', categoria: 'Expressions' },
    { palabra: 'Pastuso', categoria: 'Expressions' },
    { palabra: 'Poner los cachos', categoria: 'Conflicts' },
    { palabra: 'Tunda', categoria: 'Conflicts' }
  ];

  for (const update of updates) {
    try {
      const result = await pool.query(
        'UPDATE palabras SET categoria = $1 WHERE palabra = $2 AND region_id = 2 RETURNING palabra, categoria',
        [update.categoria, update.palabra]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ ${update.palabra} → ${update.categoria}`);
      } else {
        console.log(`⚠️  ${update.palabra} no encontrada`);
      }
    } catch (error) {
      console.error(`❌ Error con ${update.palabra}:`, error.message);
    }
  }

  // Verificar el resultado
  console.log('\n📊 Verificando categorías actualizadas:');
  const check = await pool.query(
    `SELECT categoria, COUNT(*) as count 
     FROM palabras 
     WHERE region_id = 2 
     GROUP BY categoria 
     ORDER BY categoria`
  );
  
  check.rows.forEach(row => {
    console.log(`  ${row.categoria}: ${row.count} palabras`);
  });

  pool.end();
  console.log('\n✨ ¡Proceso completado!');
};

fixCategories().catch(err => {
  console.error('Error:', err);
  pool.end();
});
