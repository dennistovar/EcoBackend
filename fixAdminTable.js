const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fixAdminTable() {
  try {
    console.log('Verificando estructura de tabla administradores...\n');

    // 1. Verificar columnas existentes
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'administradores'
      ORDER BY ordinal_position
    `);

    console.log('Columnas actuales:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    // 2. Agregar columna email si no existe
    const hasEmail = columns.rows.some(col => col.column_name === 'email');
    
    if (!hasEmail) {
      console.log('\n Agregando columna email...');
      await pool.query(`
        ALTER TABLE administradores 
        ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE
      `);
      console.log('Columna email agregada');
    }

    // 3. Verificar admin existente
    const admin = await pool.query('SELECT * FROM administradores WHERE nombre_usuario = $1', ['admin']);

    if (admin.rows.length === 0) {
      console.log('\n Creando administrador...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      await pool.query(
        'INSERT INTO administradores (nombre_usuario, email, clave_hash) VALUES ($1, $2, $3)',
        ['admin', 'admin@ecolexic.com', hashedPassword]
      );
      
      console.log(' Admin creado');
    } else {
      console.log('\n Actualizando admin existente...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      await pool.query(
        'UPDATE administradores SET clave_hash = $1, email = $2 WHERE nombre_usuario = $3',
        [hashedPassword, 'admin@ecolexic.com', 'admin']
      );
      
      console.log('Admin actualizado');
    }

    // 4. Verificar resultado final
    const finalAdmin = await pool.query('SELECT * FROM administradores WHERE nombre_usuario = $1', ['admin']);
    const isValid = await bcrypt.compare('admin123', finalAdmin.rows[0].clave_hash);

    console.log('\n📋 CONFIGURACIÓN FINAL:');
    console.log('─────────────────────────────────');
    console.log('Usuario:', finalAdmin.rows[0].nombre_usuario);
    console.log('Email:', finalAdmin.rows[0].email || 'N/A');
    console.log('Password válida:', isValid ? 'SÍ ✓' : 'NO ✗');
    console.log('─────────────────────────────────');
    console.log('\n Credenciales de login:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n URL: http://localhost:5173/admin-login');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixAdminTable();
