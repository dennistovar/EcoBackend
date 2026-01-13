const jwt = require('jsonwebtoken');

// ==========================================
// MIDDLEWARE: Verificar Token JWT
// ==========================================
const verifyToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log(' Token no proporcionado - Header Authorization ausente');
    return res.status(403).json({ 
      message: 'Se requiere un token para autenticarse' 
    });
  }

  try {
    // Extraer el token (remover "Bearer " si existe)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardar los datos del usuario en req.user
    req.user = decoded;

    console.log(' Token verificado exitosamente');
    console.log('   User ID:', decoded.id);
    console.log('   Email:', decoded.email);
    console.log('   Rol:', decoded.rol);
    
    next();
  } catch (err) {
    console.error(' Error verificando token:', err.message);
    return res.status(401).json({ 
      message: 'Token inválido o expirado' 
    });
  }
};

// ==========================================
// MIDDLEWARE: Verificar Rol de Administrador
// ==========================================
const isAdmin = (req, res, next) => {
  // Si req.user no existe, intentar verificar el token primero
  if (!req.user) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      console.log(' isAdmin: Token no proporcionado');
      return res.status(403).json({ 
        message: 'Se requiere un token para autenticarse' 
      });
    }

    try {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error(' isAdmin: Error verificando token:', err.message);
      return res.status(401).json({ 
        message: 'Token inválido' 
      });
    }
  }

  //  CRÍTICO: Logs de debug para diagnóstico
  console.log('═══════════════════════════════════════════');
  console.log(' MIDDLEWARE isAdmin - Verificación de Rol');
  console.log('   User Payload:', req.user);
  console.log('   Rol actual:', req.user.rol);
  console.log('   Tipo de rol:', typeof req.user.rol);
  console.log('═══════════════════════════════════════════');

  //  CRÍTICO: Verificar que el rol sea exactamente 'admin'
  if (req.user.rol !== 'admin') {
    console.log(' ACCESO DENEGADO');
    console.log('   Rol requerido: "admin"');
    console.log('   Rol actual:', req.user.rol);
    
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.',
      currentRole: req.user.rol
    });
  }

  console.log(' ACCESO PERMITIDO - Usuario es administrador');
  next();
};

// Alias para compatibilidad con código existente
const verifyAdmin = isAdmin;

module.exports = {
  verifyToken,
  isAdmin,
  verifyAdmin
};
