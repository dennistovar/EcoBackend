const db = require('../config/db');

exports.getAllWords = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM palabras');
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
  const { palabra, significado, ejemplo, pronunciacion, audio_url, region_id, provincia_id } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO palabras (palabra, significado, ejemplo, pronunciacion, audio_url, region_id, provincia_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [palabra, significado, ejemplo, pronunciacion, audio_url, region_id, provincia_id || 1]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.updateWord = async (req, res) => {
  const { id } = req.params;
  const { palabra, significado, ejemplo, pronunciacion, audio_url, region_id, provincia_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE palabras SET palabra=$1, significado=$2, ejemplo=$3, pronunciacion=$4, audio_url=$5, region_id=$6, provincia_id=$7 WHERE id=$8 RETURNING *',
      [palabra, significado, ejemplo, pronunciacion, audio_url, region_id, provincia_id, id]
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