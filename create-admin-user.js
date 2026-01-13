// ==========================================
// SCRIPT: Crear Usuario Administrador en Base de Datos
// ==========================================
// Ejecuta este script con: node create-admin-user.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const ADMIN_EMAIL = 'admin@ecolexico.com';
const ADMIN_PASSWORD = 'admin123'; // ⚠️ Cambiar en producción
const ADMIN_USERNAME = 'Admin EcoLéxico';

const createAdminUser = async () => {
  try {
    console.log('═══════════════════════════════════════════');
    console.log(' CREANDO USUARIO ADMINISTRADOR');
    console.log('═══════════════════════════════════════════\n');

    // Paso 1: Verificar si ya existe
    console.log(' Verificando si el administrador ya existe...');
    const existingUser = await db.query(
      'SELECT id, email, rol FROM usuarios WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      console.log(`\n  Usuario ya existe:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol actual: ${user.rol}`);

      // Si no es admin, actualizar
      if (user.rol !== 'admin') {
        console.log('\n Actualizando rol a "admin"...');
        await db.query(
          'UPDATE usuarios SET rol = $1 WHERE email = $2',
          ['admin', ADMIN_EMAIL]
        );
        console.log(' Rol actualizado exitosamente');
      } else {
        console.log('\n El usuario ya tiene rol de administrador');
      }

      console.log('\n═══════════════════════════════════════════');
      console.log('CREDENCIALES DE ACCESO:');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Contraseña: ${ADMIN_PASSWORD}`);
      console.log('═══════════════════════════════════════════\n');
      
      process.exit(0);
    }

    // Paso 2: Crear nuevo usuario administrador
    console.log('\n Creando nuevo usuario administrador...');

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    console.log(' Contraseña hasheada:', hashedPassword);

    // Insertar en la base de datos
    const result = await db.query(
      `INSERT INTO usuarios (nombre_usuario, email, clave_hash, rol) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nombre_usuario, email, rol, fecha_registro`,
      [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, 'admin']
    );

    const newAdmin = result.rows[0];

    console.log('\n USUARIO ADMINISTRADOR CREADO EXITOSAMENTE\n');
    console.log('═══════════════════════════════════════════');
    console.log('INFORMACIÓN DEL ADMINISTRADOR:');
    console.log(`   ID: ${newAdmin.id}`);
    console.log(`   Nombre: ${newAdmin.nombre_usuario}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Rol: ${newAdmin.rol}`);
    console.log(`   Fecha de Registro: ${newAdmin.fecha_registro}`);
    console.log('═══════════════════════════════════════════');
    console.log('\nCREDENCIALES DE ACCESO:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Contraseña: ${ADMIN_PASSWORD}`);
    console.log('\n  IMPORTANTE: Cambia esta contraseña en producción');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n ERROR al crear el administrador:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Ejecutar el script
createAdminUser();
