const jwt = require('jsonwebtoken');

// Middleware para verificar token de autenticación
const verifyToken = (req, res, next) => {
  // Buscamos el token en el header "Authorization"
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Se requiere un token para autenticarse' });
  }

  try {
    // Quitamos la palabra "Bearer " si viene incluida
    const tokenBody = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    const decoded = jwt.verify(tokenBody, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario (id, rol, esAdmin) en la petición
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar que el usuario es administrador
const verifyAdmin = (req, res, next) => {
  // Buscamos el token en el header "Authorization"
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Se requiere un token para autenticarse' });
  }

  try {
    // Quitamos la palabra "Bearer " si viene incluida
    const tokenBody = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    const decoded = jwt.verify(tokenBody, process.env.JWT_SECRET);
    
    // Verificar que el usuario es administrador
    if (!decoded.esAdmin || decoded.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Acceso denegado. Se requieren privilegios de administrador.' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin
};