-- ==========================================
-- SCRIPT: Crear Usuario Administrador Manualmente
-- ==========================================
-- IMPORTANTE: Ejecuta este script en PostgreSQL después de crear la tabla usuarios

-- Paso 1: Verificar si ya existe un administrador
SELECT id, nombre_usuario, email, rol 
FROM usuarios 
WHERE email = 'admin@ecolexico.com';

-- Si NO existe, ejecuta el siguiente bloque (Paso 2)
-- Si YA existe, salta al Paso 3 para actualizar el rol

-- ==========================================
-- Paso 2: CREAR nuevo usuario administrador
-- ==========================================
-- NOTA: La contraseña hasheada corresponde a 'admin123' con bcrypt (10 rounds)
-- Hash generado: $2a$10$YourHashHere (debes generarlo con bcrypt)

-- OPCIÓN A: Usar contraseña pre-hasheada
INSERT INTO usuarios (nombre_usuario, email, clave_hash, rol) 
VALUES (
  'Admin EcoLéxico',
  'admin@ecolexico.com',
  '$2a$10$8K1p/a0dL3.Zy9I3E7e8yOw9zCUzdGJiLCHgJtW7S1wWx7YzW7W7i', -- admin123 hasheado
  'admin'
)
RETURNING id, nombre_usuario, email, rol;

-- ==========================================
-- Paso 3: ACTUALIZAR rol de usuario existente a admin
-- ==========================================
-- Si el usuario ya existe pero no tiene rol 'admin', actualizar:

UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'admin@ecolexico.com';

-- ==========================================
-- Paso 4: VERIFICAR que el admin fue creado/actualizado
-- ==========================================
SELECT id, nombre_usuario, email, rol, fecha_registro 
FROM usuarios 
WHERE rol = 'admin';

-- ==========================================
-- CREDENCIALES DE ACCESO
-- ==========================================
-- Email: admin@ecolexico.com
-- Contraseña: admin123
