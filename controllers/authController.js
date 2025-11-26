const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// REGISTRO DE USUARIO (Solo Turistas)
// ==========================================
exports.register = async (req, res) => {
  const { nombre_usuario, email, clave } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists. Please login instead.' });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clave, saltRounds);

    // Insertar nuevo usuario en la base de datos
    const result = await db.query(
      'INSERT INTO usuarios (nombre_usuario, email, clave_hash) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, email',
      [nombre_usuario, email, hashedPassword]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.rows[0].id,
        nombre_usuario: result.rows[0].nombre_usuario,
        email: result.rows[0].email,
        esAdmin: false,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Error en register:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ==========================================
// LOGIN (Usuarios Y Administradores)
// ==========================================
exports.login = async (req, res) => {
  console.log('Login request received:', JSON.stringify(req.body, null, 2));
  
  const { nombre_usuario, email, clave, esAdmin } = req.body;

  try {
    // Determinar el identificador (email o nombre_usuario)
    const loginIdentifier = email || nombre_usuario;
    
    if (!loginIdentifier || !clave) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    let user;
    let userRole;

    // ========================================
    // CASO 1: LOGIN DE ADMINISTRADOR
    // ========================================
    if (esAdmin === true) {
      console.log('Attempting ADMIN login for:', loginIdentifier);
      
      const result = await db.query(
        'SELECT * FROM administradores WHERE nombre_usuario = $1 OR email = $1',
        [loginIdentifier]
      );

      if (result.rows.length === 0) {
        console.log('Admin not found:', loginIdentifier);
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      user = result.rows[0];
      userRole = 'admin';
      console.log('✅ Admin found:', user.nombre_usuario);

    // ========================================
    // CASO 2: LOGIN DE USUARIO NORMAL
    // ========================================
    } else {
      console.log('Attempting USER login for:', loginIdentifier);
      
      const result = await db.query(
        'SELECT * FROM usuarios WHERE email = $1 OR nombre_usuario = $1',
        [loginIdentifier]
      );

      if (result.rows.length === 0) {
        console.log('User not found:', loginIdentifier);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      user = result.rows[0];
      userRole = 'user';
      console.log('User found:', user.nombre_usuario);
    }

    // ========================================
    // VERIFICAR CONTRASEÑA (AMBOS CASOS)
    // ========================================
    const isPasswordValid = await bcrypt.compare(clave, user.clave_hash);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for:', user.nombre_usuario);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ========================================
    // GENERAR TOKEN JWT
    // ========================================
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: userRole 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', user.nombre_usuario, '- Role:', userRole);

    // ========================================
    // RESPUESTA EXITOSA
    // ========================================
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
        esAdmin: userRole === 'admin',
        role: userRole
      }
    });

  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
