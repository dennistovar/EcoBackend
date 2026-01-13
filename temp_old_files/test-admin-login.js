/**
 * Script de prueba para verificar el login y el rol del admin
 * Ejecutar con: node test-admin-login.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAdminLogin() {
  console.log(' Probando login del administrador...\n');

  try {
    // 1. Login como admin
    console.log('1️Intentando login con admin@ecolexico.com...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ecolexico.com',
      clave: 'admin123'
    });

    console.log(' Login exitoso!');
    console.log(' Datos del usuario:', JSON.stringify(loginResponse.data.user, null, 2));
    console.log(' Token recibido:', loginResponse.data.token.substring(0, 30) + '...\n');

    const token = loginResponse.data.token;
    const userRol = loginResponse.data.user.rol;

    // 2. Verificar el rol
    console.log('2️ Verificando rol del usuario...');
    if (userRol === 'admin') {
      console.log(' Rol correcto: admin\n');
    } else {
      console.log(` Rol incorrecto: ${userRol} (debería ser 'admin')\n`);
      process.exit(1);
    }

    // 3. Intentar acceder a una ruta protegida (simulación)
    console.log('3️ Simulando acceso a ruta protegida con isAdmin...');
    console.log('   Token enviado en header Authorization\n');

    // Se realizaría una petición a una ruta protegida
    // Por ejemplo: await axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` }})
    
    console.log(' Para probar una ruta protegida real:');
    console.log('   1. Crea una ruta de prueba en tu backend');
    console.log('   2. Protégela con el middleware isAdmin');
    console.log('   3. Haz una petición con el token recibido\n');

    // 4. Decodificar el token para ver su contenido
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    
    console.log('4️ Contenido del token decodificado:');
    console.log(JSON.stringify(decoded, null, 2));
    
    if (decoded.rol === 'admin') {
      console.log('\n ¡TODO CORRECTO! El token contiene rol: "admin"');
    } else {
      console.log(`\n ERROR: El token tiene rol: "${decoded.rol}" en lugar de "admin"`);
      process.exit(1);
    }

  } catch (error) {
    console.error(' Error durante la prueba:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message);
    } else {
      console.error('   ', error.message);
    }
    console.error('\n Asegúrate de que el servidor esté corriendo en puerto 5000');
    process.exit(1);
  }
}

// Probar también un login de turista
async function testTuristaLogin() {
  console.log('\n Probando login de un usuario turista...\n');

  try {
    // Primero crear un usuario turista de prueba
    console.log('1️ Creando usuario turista de prueba...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      nombre_usuario: 'Test Turista',
      email: 'turista@test.com',
      clave: 'test123'
    });

    console.log(' Usuario turista creado');
    console.log(' Rol del turista:', registerResponse.data.user.rol);

    if (registerResponse.data.user.rol === 'turista') {
      console.log(' Rol correcto: turista\n');
    } else {
      console.log(` Rol incorrecto: ${registerResponse.data.user.rol}\n`);
    }

    // Decodificar el token del turista
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(registerResponse.data.token);
    
    console.log('2️ Token del turista contiene:');
    console.log('   - id:', decoded.id);
    console.log('   - email:', decoded.email);
    console.log('   - rol:', decoded.rol);
    
    if (decoded.rol === 'turista') {
      console.log('\n ¡TODO CORRECTO! El token del turista es válido');
    }

  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log(' Usuario turista ya existe (ignorando error)\n');
    } else {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log(' PRUEBA DE SISTEMA RBAC - LOGIN Y ROLES');
  console.log('='.repeat(60) + '\n');

  await testAdminLogin();
  await testTuristaLogin();

  console.log('\n' + '='.repeat(60));
  console.log(' TODAS LAS PRUEBAS COMPLETADAS');
  console.log('='.repeat(60));
}

runTests();
