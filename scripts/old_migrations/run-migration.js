/**
 * Script para ejecutar la migración SQL desde Node.js
 * Ejecutar con: node run-migration.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runMigration() {
  try {
    console.log(' Iniciando migración RBAC...\n');

    // Leer el archivo SQL
    const migrationPath = path.join(__dirname, 'migrations', '001_add_rol_to_usuarios.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Ejecutar la migración
    console.log(' Ejecutando script SQL...');
    await pool.query(sql);

    console.log(' Migración completada exitosamente!\n');
    console.log(' Cambios realizados:');
    console.log('   -  Columna "rol" agregada a tabla usuarios');
    console.log('   -  Tabla "administradores" eliminada');
    console.log('   -  Índice creado en columna "rol"');
    console.log('   -  Constraint de validación agregado');

    // Verificar la migración
    console.log('\n Verificando cambios...');
    const result = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' AND column_name = 'rol'
    `);

    if (result.rows.length > 0) {
      console.log(' Columna "rol" confirmada:');
      console.log(`   - Tipo: ${result.rows[0].data_type}`);
      console.log(`   - Default: ${result.rows[0].column_default}`);
    }

    // Contar usuarios por rol
    const stats = await pool.query(`
      SELECT rol, COUNT(*) as total 
      FROM usuarios 
      GROUP BY rol
    `);

    console.log('\n Usuarios por rol:');
    stats.rows.forEach(row => {
      console.log(`   - ${row.rol}: ${row.total} usuario(s)`);
    });

    console.log('\n ¡Migración RBAC completada! Ahora puedes iniciar el servidor.\n');

  } catch (error) {
    console.error(' Error durante la migración:', error.message);
    console.error('\n Sugerencias:');
    console.error('   1. Verifica que la base de datos existe');
    console.error('   2. Revisa las credenciales en el archivo .env');
    console.error('   3. Asegúrate de que la tabla "usuarios" existe');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
