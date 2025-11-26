const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

// Ruta para obtener todas las palabras
router.get('/', wordController.getAllWords);

// Ruta para crear una nueva palabra
router.post('/', wordController.createWord);

// Ruta para actualizar una palabra
router.put('/:id', wordController.updateWord);

// Ruta para eliminar una palabra
router.delete('/:id', wordController.deleteWord);

module.exports = router;