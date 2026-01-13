#!/usr/bin/env node

/**
 * Script de prueba para verificar el sistema RBAC
 * Ejecutar con: node test-rbac.js
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log(' Iniciando pruebas del sistema RBAC...\n');

// ==========================================
// TEST 1: Verificar hash de contraseñas
// ==========================================
console.log(' TEST 1: Verificación de bcrypt');
const testPassword = 'admin123';
bcrypt.hash(testPassword, 10).then(hash => {
  console.log(' Hash generado:', hash.substring(0, 30) + '...');
  
  bcrypt.compare(testPassword, hash).then(isValid => {
    console.log(' Validación de contraseña:', isValid ? 'Correcta' : 'Incorrecta');
  });
});

// ==========================================
// TEST 2: Generar y verificar JWT
// ==========================================
console.log('\n TEST 2: Generación y verificación de JWT');

const adminPayload = {
  id: 1,
  email: 'admin@ecolexico.com',
  rol: 'admin'
};

const turistaPayload = {
  id: 2,
  email: 'turista@ejemplo.com',
  rol: 'turista'
};

const adminToken = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
const turistaToken = jwt.sign(turistaPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

console.log(' Token Admin generado:', adminToken.substring(0, 30) + '...');
console.log(' Token Turista generado:', turistaToken.substring(0, 30) + '...');

// Verificar tokens
try {
  const decodedAdmin = jwt.verify(adminToken, process.env.JWT_SECRET);
  console.log(' Token Admin verificado:', decodedAdmin);
  
  const decodedTurista = jwt.verify(turistaToken, process.env.JWT_SECRET);
  console.log(' Token Turista verificado:', decodedTurista);
} catch (error) {
  console.error(' Error al verificar tokens:', error.message);
}

// ==========================================
// TEST 3: Simulación de middleware isAdmin
// ==========================================
console.log('\n TEST 3: Simulación de middleware isAdmin');

const simulateIsAdmin = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.rol !== 'admin') {
      return { success: false, message: 'Acceso denegado. Se requieren privilegios de administrador.' };
    }
    
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, message: 'Token inválido' };
  }
};

const adminTest = simulateIsAdmin(adminToken);
const turistaTest = simulateIsAdmin(turistaToken);

console.log('Admin intentando acceder a ruta protegida:', 
  adminTest.success ? ' ACCESO PERMITIDO' : ' ACCESO DENEGADO');

console.log('Turista intentando acceder a ruta protegida:', 
  turistaTest.success ? ' ACCESO PERMITIDO' : ' ACCESO DENEGADO',
  '-', turistaTest.message);

// ==========================================
// TEST 4: Verificar variables de entorno
// ==========================================
console.log('\n TEST 4: Variables de entorno');
console.log('DB_HOST:', process.env.DB_HOST ? '' : ' NO DEFINIDO');
console.log('DB_NAME:', process.env.DB_NAME ? '' : ' NO DEFINIDO');
console.log('DB_USER:', process.env.DB_USER ? '' : ' NO DEFINIDO');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '' : ' NO DEFINIDO');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '' : ' NO DEFINIDO');

// ==========================================
// RESUMEN
// ==========================================
setTimeout(() => {
  console.log('\n' + '='.repeat(50));
  console.log(' Todas las pruebas completadas');
  console.log('='.repeat(50));
  console.log('\n Para probar el sistema completo:');
  console.log('   1. Ejecuta la migración SQL');
  console.log('   2. Inicia el servidor: npm start');
  console.log('   3. Prueba el login con admin@ecolexico.com / admin123');
}, 1000);
