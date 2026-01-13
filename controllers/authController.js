const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// REGISTRO DE USUARIO (Solo Turistas)
// ==========================================
exports.register = async (req, res) => {
  const { nombre_usuario, email, clave } = req.body;

  try {
    // Validar campos requeridos
    if (!nombre_usuario || !email || !clave) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos (nombre_usuario, email, clave)' 
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ 
        message: 'User already exists. Please login instead.' 
      });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clave, saltRounds);

    // Insertar nuevo usuario en la base de datos (siempre como 'turista')
    const result = await db.query(
      'INSERT INTO usuarios (nombre_usuario, email, clave_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre_usuario, email, rol',
      [nombre_usuario, email, hashedPassword, 'turista']
    );

    const newUser = result.rows[0];

    //  CRÍTICO: Generar token JWT con el ROL incluido en el payload
    const payload = {
      id: newUser.id,
      email: newUser.email,
      rol: newUser.rol //  CRÍTICO: Incluir el rol
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(' Usuario registrado:', {
      id: newUser.id,
      email: newUser.email,
      rol: newUser.rol
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        nombre_usuario: newUser.nombre_usuario,
        email: newUser.email,
        rol: newUser.rol
      }
    });
  } catch (err) {
    console.error(' Error en register:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ==========================================
// LOGIN (Usuarios y Administradores)
// ==========================================
exports.login = async (req, res) => {
  const { nombre_usuario, email, clave } = req.body;

  try {
    // Determinar el identificador (email o nombre_usuario)
    const loginIdentifier = email || nombre_usuario;
    
    if (!loginIdentifier || !clave) {
      return res.status(400).json({ 
        message: 'Username/Email and password are required' 
      });
    }

    // Buscar usuario en la tabla usuarios
    const result = await db.query(
      'SELECT id, nombre_usuario, email, clave_hash, rol FROM usuarios WHERE email = $1 OR nombre_usuario = $1',
      [loginIdentifier]
    );

    if (result.rows.length === 0) {
      console.log(' Login fallido: Usuario no encontrado:', loginIdentifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(clave, user.clave_hash);

    if (!isPasswordValid) {
      console.log(' Login fallido: Contraseña incorrecta para:', user.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //  CRÍTICO: Crear payload del JWT con el ROL
    const payload = { 
      id: user.id, 
      email: user.email, 
      rol: user.rol //  CRÍTICO: Asegurar que el rol esté en el payload
    };

    // DEBUG: Mostrar información del usuario desde la BD
    console.log('═══════════════════════════════════════════');
    console.log(' LOGIN EXITOSO - Información del Usuario:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Nombre:', user.nombre_usuario);
    console.log('   Rol desde BD:', user.rol);
    console.log('   Payload JWT:', payload);
    console.log('═══════════════════════════════════════════');

    // Generar token JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(' Token JWT generado exitosamente');

    // Respuesta exitosa
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error(' Error in login:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
