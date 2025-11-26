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

async function verifyAdminPassword() {
  try {
    const email = 'admin@example.com';
    const testPassword = 'admin123';

    // Buscar el usuario
    const result = await pool.query(
      'SELECT id, nombre_usuario, email, clave_hash FROM usuarios WHERE nombre_usuario = $1 OR email = $2',
      ['admin', email]
    );

    if (result.rows.length === 0) {
      console.log(' Usuario admin no encontrado');
      console.log('\n Creando usuario admin...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
      
      const newUser = await pool.query(
        'INSERT INTO usuarios (nombre_usuario, email, clave_hash) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, email',
        ['admin', email, hashedPassword]
      );
      
      console.log(' Usuario admin creado:');
      console.log('   ID:', newUser.rows[0].id);
      console.log('   Username:', newUser.rows[0].nombre_usuario);
      console.log('   Email:', newUser.rows[0].email);
    } else {
      const user = result.rows[0];
      console.log(' Usuario encontrado:');
      console.log('   ID:', user.id);
      console.log('   Username:', user.nombre_usuario);
      console.log('   Email:', user.email);
      console.log('   Hash:', user.clave_hash.substring(0, 30) + '...');
      
      // Verificar si el hash es de bcrypt
      const isBcryptHash = user.clave_hash.startsWith('$2a$') || user.clave_hash.startsWith('$2b$');
      console.log('\n ¿Es hash de bcrypt?', isBcryptHash);
      
      if (!isBcryptHash) {
        console.log('\n  La contraseña NO está hasheada con bcrypt');
        console.log(' Actualizando contraseña...');
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
        
        await pool.query(
          'UPDATE usuarios SET clave_hash = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        
        console.log(' Contraseña actualizada correctamente');
      } else {
        // Verificar si la contraseña coincide
        const isValid = await bcrypt.compare(testPassword, user.clave_hash);
        console.log(' ¿Contraseña "admin123" es válida?', isValid);
        
        if (!isValid) {
          console.log('\n  La contraseña no coincide, actualizando...');
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
          
          await pool.query(
            'UPDATE usuarios SET clave_hash = $1 WHERE id = $2',
            [hashedPassword, user.id]
          );
          
          console.log(' Contraseña actualizada a "admin123"');
        }
      }
    }
    
    console.log('\n Credenciales de login:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
}

verifyAdminPassword();
