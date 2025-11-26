require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

require('./config/db'); 

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

const wordRoutes = require('./routes/wordRoutes'); // Importamos la ruta
const authRoutes = require('./routes/authRoutes'); // Importamos las rutas de autenticación
const favoritesRoutes = require('./routes/favoritesRoutes');

app.use('/api/words', wordRoutes);                 // La activamos
app.use('/api/auth', authRoutes);                  // Activamos las rutas de autenticación
app.use('/api/favorites', favoritesRoutes);


// --- RUTAS DE PRUEBA ---
app.get('/', (req, res) => {
  res.send('API del Backend EcoLéxico funcionando correctamente 🚀');
});

// ... el resto sigue igual ...
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

