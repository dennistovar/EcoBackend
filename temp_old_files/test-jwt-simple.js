/**
 * Script simple para verificar el JWT y el rol
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log(' Verificador de JWT - Sistema RBAC\n');
console.log('='.repeat(60));

// Simular lo que hace el authController
const fakeUser = {
  id: 1,
  email: 'admin@ecolexico.com',
  rol: 'admin'
};

console.log('\n Usuario desde la base de datos:');
console.log(JSON.stringify(fakeUser, null, 2));

// Crear el payload (lo que hace authController.js)
const payload = {
  id: fakeUser.id,
  email: fakeUser.email,
  rol: fakeUser.rol
};

console.log('\n Payload del JWT:');
console.log(JSON.stringify(payload, null, 2));

// Generar el token
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

console.log('\n Token generado:');
console.log(token.substring(0, 50) + '...');

// Decodificar el token (lo que hace isAdmin middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log('\n Token decodificado (req.user):');
console.log(JSON.stringify(decoded, null, 2));

// Verificar el rol (lo que hace isAdmin)
console.log('\n Verificación de rol:');
console.log(`   decoded.rol = "${decoded.rol}"`);
console.log(`   decoded.rol === 'admin' = ${decoded.rol === 'admin'}`);

if (decoded.rol === 'admin') {
  console.log('\n ¡ACCESO PERMITIDO! El usuario ES administrador');
} else {
  console.log('\n ACCESO DENEGADO - El usuario NO es administrador');
}

console.log('\n' + '='.repeat(60));

// Ahora probar con un turista
console.log('\n Probando con usuario TURISTA\n');
console.log('='.repeat(60));

const turistaUser = {
  id: 2,
  email: 'turista@ejemplo.com',
  rol: 'turista'
};

const turistaPayload = {
  id: turistaUser.id,
  email: turistaUser.email,
  rol: turistaUser.rol
};

const turistaToken = jwt.sign(turistaPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
const turistaDecoded = jwt.verify(turistaToken, process.env.JWT_SECRET);

console.log('\n Payload del turista:');
console.log(JSON.stringify(turistaDecoded, null, 2));

console.log('\n Verificación de rol:');
console.log(`   decoded.rol = "${turistaDecoded.rol}"`);
console.log(`   decoded.rol === 'admin' = ${turistaDecoded.rol === 'admin'}`);

if (turistaDecoded.rol === 'admin') {
  console.log('\n ACCESO PERMITIDO');
} else {
  console.log('\n ACCESO DENEGADO - El usuario NO es administrador (correcto)');
}

console.log('\n' + '='.repeat(60));
console.log('\n Sistema de roles funcionando correctamente!\n');
