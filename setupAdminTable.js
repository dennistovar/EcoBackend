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

async function setupAdminTable() {
  try {
    console.log('🔧 Configurando tabla de administradores...\n');

    // 1. Crear tabla administradores si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS administradores (
        id SERIAL PRIMARY KEY,
        nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        clave_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla "administradores" creada/verificada');

    // 2. Verificar si ya existe el admin
    const adminExists = await pool.query(
      'SELECT * FROM administradores WHERE nombre_usuario = $1',
      ['admin']
    );

    if (adminExists.rows.length > 0) {
      console.log(' El admin ya existe. Actualizando contraseña...\n');
      
      // Actualizar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      await pool.query(
        'UPDATE administradores SET clave_hash = $1, email = $2 WHERE nombre_usuario = $3',
        [hashedPassword, 'admin@ecolexic.com', 'admin']
      );
      
      console.log(' Admin actualizado correctamente');
    } else {
      console.log(' Creando nuevo administrador...\n');
      
      // 3. Crear el admin
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      const result = await pool.query(
        'INSERT INTO administradores (nombre_usuario, email, clave_hash) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, email',
        ['admin', 'admin@ecolexic.com', hashedPassword]
      );

      console.log(' Administrador creado exitosamente:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Username:', result.rows[0].nombre_usuario);
      console.log('   Email:', result.rows[0].email);
    }

    // 4. Verificar que todo esté correcto
    console.log('\n Verificando credenciales...');
    const admin = await pool.query(
      'SELECT * FROM administradores WHERE nombre_usuario = $1',
      ['admin']
    );

    const isValid = await bcrypt.compare('admin123', admin.rows[0].clave_hash);
    
    console.log('\n RESUMEN:');
    console.log('─────────────────────────────────');
    console.log('Tabla: administradores');
    console.log('Usuario: admin');
    console.log('Email: admin@ecolexic.com');
    console.log('Password: admin123');
    console.log('Hash válido:', isValid ? 'SÍ' : 'NO');
    console.log('─────────────────────────────────');
    console.log('\n Puedes iniciar sesión en: http://localhost:5173/admin-login');

    process.exit(0);
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
}

setupAdminTable();
