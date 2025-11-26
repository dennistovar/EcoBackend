const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Buscamos el token en el header "Authorization"
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Se requiere un token para autenticarse');
  }

  try {
    // Quitamos la palabra "Bearer " si viene incluida
    const tokenBody = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    const decoded = jwt.verify(tokenBody, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario (id, rol) en la petición
    next();
  } catch (err) {
    return res.status(401).send('Token inválido');
  }
};

module.exports = verifyToken;