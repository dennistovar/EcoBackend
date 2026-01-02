const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Ruta pública para obtener todas las palabras
router.get('/', wordController.getAllWords);

// Rutas protegidas SOLO para administradores
router.post('/', verifyAdmin, wordController.createWord);
router.put('/:id', verifyAdmin, wordController.updateWord);
router.delete('/:id', verifyAdmin, wordController.deleteWord);

module.exports = router;