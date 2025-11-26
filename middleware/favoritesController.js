const db = require('../config/db');

// AGREGAR FAVORITO
exports.addFavorite = async (req, res) => {
  try {
    console.log('Datos recibidos para favorito:', JSON.stringify(req.body, null, 2));
    console.log('Usuario desde token:', req.user);
    
    const { word_id } = req.body;
    const user_id = req.user.id; // Viene del token

    if (!word_id) {
      console.log('Falta word_id en el body');
      return res.status(400).json({ message: 'word_id es requerido' });
    }

    console.log('Verificando si ya existe favorito...');
    
    // Verificar si ya existe
    const check = await db.query(
      'SELECT * FROM usuario_favoritos WHERE usuario_id = $1 AND palabra_id = $2',
      [user_id, word_id]
    );

    if (check.rows.length > 0) {
      console.log('Ya está en favoritos, devolviendo 200');
      return res.status(200).json({ message: 'Ya está en favoritos', alreadyExists: true });
    }

    console.log('Insertando favorito...');
    
    // Insertar
    await db.query(
      'INSERT INTO usuario_favoritos (usuario_id, palabra_id) VALUES ($1, $2)',
      [user_id, word_id]
    );

    console.log('Favorito guardado exitosamente');
    res.status(201).json({ message: 'Guardado en favoritos' });
  } catch (err) {
    console.error('Error al guardar favorito:', err);
    res.status(500).json({ message: 'Error al guardar favorito' });
  }
};

// OBTENER FAVORITOS
exports.getFavorites = async (req, res) => {
  try {
    console.log('Obteniendo favoritos para usuario:', req.user);
    const user_id = req.user.id;
    
    // Hacemos un JOIN para traer los datos completos de la palabra
    const query = `
      SELECT p.* FROM palabras p
      JOIN usuario_favoritos uf ON p.id = uf.palabra_id
      WHERE uf.usuario_id = $1
    `;
    
    console.log('Ejecutando query con user_id:', user_id);
    const result = await db.query(query, [user_id]);
    
    console.log(' Favoritos encontrados:', result.rows.length);
    console.log(' Datos:', JSON.stringify(result.rows, null, 2));
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener favoritos:', err);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

// BORRAR FAVORITO
exports.removeFavorite = async (req, res) => {
  try {
    const { word_id } = req.params;
    const user_id = req.user.id;

    await db.query(
      'DELETE FROM usuario_favoritos WHERE usuario_id = $1 AND palabra_id = $2',
      [user_id, word_id]
    );

    res.json({ message: 'Eliminado de favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar');
  }
};