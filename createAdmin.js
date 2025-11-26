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

async function createAdminUser() {
  try {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'admin123';

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      console.log('El usuario admin ya existe en la base de datos');
      process.exit(0);
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el usuario admin
    const result = await pool.query(
      'INSERT INTO usuarios (nombre_usuario, email, clave_hash) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, email',
      [username, email, hashedPassword]
    );

    console.log('Usuario admin creado exitosamente:');
    console.log('   ID:', result.rows[0].id);
    console.log('   Username:', result.rows[0].nombre_usuario);
    console.log('   Email:', result.rows[0].email);
    console.log('\n Email: admin@example.com');
    console.log(' Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario admin:', error.message);
    process.exit(1);
  }
}

createAdminUser();
