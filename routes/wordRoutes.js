const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Ruta pública para obtener todas las palabras
router.get('/', wordController.getAllWords);

// Rutas protegidas SOLO para administradores
router.post('/', isAdmin, wordController.createWord);
router.put('/:id', isAdmin, wordController.updateWord);
router.delete('/:id', isAdmin, wordController.deleteWord);

module.exports = router;