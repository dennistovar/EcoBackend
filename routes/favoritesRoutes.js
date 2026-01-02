const express = require('express');
const router = express.Router();
const favoritesController = require('../middleware/favoritesController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas estas rutas están protegidas por 'verifyToken'
router.post('/', verifyToken, favoritesController.addFavorite);
router.get('/', verifyToken, favoritesController.getFavorites);
router.delete('/:word_id', verifyToken, favoritesController.removeFavorite);

module.exports = router;