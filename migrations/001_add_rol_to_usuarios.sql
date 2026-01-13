-- ==========================================
-- MIGRACIÓN: Agregar sistema de roles RBAC
-- ==========================================
-- Fecha: 2026-01-12
-- Descripción: Migra de dos tablas (usuarios/administradores) a una sola tabla con roles

BEGIN;

-- 1. Agregar columna 'rol' a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'turista';

-- 2. Migrar datos existentes (si hay columna es_admin, actualizar roles)
UPDATE usuarios 
SET rol = 'admin' 
WHERE es_admin = true;

-- 3. Eliminar columna es_admin si existe (opcional, mantener compatibilidad temporal)
-- ALTER TABLE usuarios DROP COLUMN IF EXISTS es_admin;

-- 4. Eliminar tabla administradores si existe
DROP TABLE IF EXISTS administradores CASCADE;

-- 5. Agregar índice en la columna rol para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- 6. Agregar constraint para validar roles permitidos
ALTER TABLE usuarios 
ADD CONSTRAINT chk_rol_valido 
CHECK (rol IN ('turista', 'admin'));

COMMIT;

-- ==========================================
-- ROLLBACK (si algo sale mal)
-- ==========================================
-- BEGIN;
-- ALTER TABLE usuarios DROP COLUMN IF EXISTS rol;
-- COMMIT;
