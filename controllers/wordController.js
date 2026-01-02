const db = require('../config/db');

exports.getAllWords = async (req, res) => {
  try {
    const { region_id, categoria } = req.query;
    
    let query = 'SELECT * FROM palabras WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    // Filtrar por región si se proporciona
    if (region_id) {
      query += ` AND region_id = $${paramCount}`;
      params.push(region_id);
      paramCount++;
    }
    
    // Filtrar por categoría si se proporciona
    if (categoria) {
      query += ` AND categoria = $${paramCount}`;
      params.push(categoria);
      paramCount++;
    }
    
    query += ' ORDER BY palabra ASC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

exports.deleteWord = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM palabras WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Palabra no encontrada' });
    }

    res.status(200).json({ message: 'Palabra eliminada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.createWord = async (req, res) => {
  const { palabra, significado, ejemplo, audio_url, region_id, provincia_id, categoria } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO palabras (palabra, significado, ejemplo, audio_url, region_id, provincia_id, categoria) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [palabra, significado, ejemplo, audio_url, region_id, provincia_id || 1, categoria || 'General']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.updateWord = async (req, res) => {
  const { id } = req.params;
  const { palabra, significado, ejemplo, audio_url, region_id, provincia_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE palabras SET palabra=$1, significado=$2, ejemplo=$3, audio_url=$4, region_id=$5, provincia_id=$6 WHERE id=$7 RETURNING *',
      [palabra, significado, ejemplo, audio_url, region_id, provincia_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Palabra no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};