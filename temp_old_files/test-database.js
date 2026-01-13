/**
 * Script de prueba para verificar la conexión y obtener palabras
 */

require('dotenv').config();
const db = require('./config/db');

async function testDatabase() {
  console.log(' Probando conexión a la base de datos...\n');

  try {
    // 1. Verificar que hay palabras en la BD
    console.log('1️ Verificando palabras en la base de datos...');
    const palabrasResult = await db.query('SELECT COUNT(*) FROM palabras');
    const totalPalabras = parseInt(palabrasResult.rows[0].count);
    
    console.log(`   Total de palabras: ${totalPalabras}`);
    
    if (totalPalabras === 0) {
      console.log('     No hay palabras en la base de datos');
      console.log('    Necesitas ejecutar los scripts de seed para cargar datos');
    } else {
      // Mostrar algunas palabras de ejemplo
      const ejemplos = await db.query('SELECT id, palabra, region_id, categoria FROM palabras LIMIT 5');
      console.log('\n   Ejemplos de palabras:');
      ejemplos.rows.forEach(p => {
        console.log(`   - ID: ${p.id}, Palabra: "${p.palabra}", Región: ${p.region_id}, Categoría: ${p.categoria}`);
      });
    }

    // 2. Verificar usuarios
    console.log('\n Verificando usuarios...');
    const usuariosResult = await db.query('SELECT email, rol FROM usuarios');
    console.log(`   Total usuarios: ${usuariosResult.rows.length}`);
    usuariosResult.rows.forEach(u => {
      console.log(`   - ${u.email} (${u.rol})`);
    });

    // 3. Verificar estructura de la tabla palabras
    console.log('\n Verificando estructura de tabla palabras...');
    const columnsResult = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'palabras'
      ORDER BY ordinal_position
    `);
    
    console.log('   Columnas de la tabla palabras:');
    columnsResult.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n Pruebas completadas\n');
    process.exit(0);

  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
}

testDatabase();
