const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const db = require('../config/db');

// ==========================================
// RUTAS DEL DASHBOARD - SOLO ADMINISTRADORES
// ==========================================

// GET /api/admin/dashboard - Obtener datos del dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    console.log(' Accediendo al dashboard - Usuario:', req.user.email, '- Rol:', req.user.rol);

    // Obtener estadísticas
    const totalUsuarios = await db.query('SELECT COUNT(*) FROM usuarios WHERE rol = $1', ['turista']);
    const totalAdmins = await db.query('SELECT COUNT(*) FROM usuarios WHERE rol = $1', ['admin']);
    const totalPalabras = await db.query('SELECT COUNT(*) FROM palabras');

    res.json({
      message: 'Dashboard data',
      stats: {
        totalUsuarios: parseInt(totalUsuarios.rows[0].count),
        totalAdministradores: parseInt(totalAdmins.rows[0].count),
        totalPalabras: parseInt(totalPalabras.rows[0].count)
      },
      user: {
        id: req.user.id,
        email: req.user.email,
        rol: req.user.rol
      }
    });
  } catch (error) {
    console.error(' Error obteniendo datos del dashboard:', error.message);
    res.status(500).json({ message: 'Error obteniendo datos del dashboard' });
  }
});

// GET /api/admin/users - Listar todos los usuarios
router.get('/users', isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nombre_usuario, email, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(' Error obteniendo usuarios:', error.message);
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

// PUT /api/admin/users/:id/role - Cambiar rol de usuario
router.put('/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // Validar rol
    if (!['turista', 'admin'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // No permitir que el admin se quite sus propios privilegios
    if (parseInt(id) === req.user.id && rol !== 'admin') {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol de administrador' });
    }

    const result = await db.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, nombre_usuario, email, rol',
      [rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: `Rol actualizado a ${rol}`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error(' Error actualizando rol:', error.message);
    res.status(500).json({ message: 'Error actualizando rol' });
  }
});

module.exports = router;
