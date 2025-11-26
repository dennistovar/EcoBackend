const axios = require('axios');

async function testLogin() {
  try {
    console.log(' Probando login con credenciales...');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123\n');

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log(' LOGIN EXITOSO!\n');
    console.log(' Respuesta del servidor:');
    console.log('   Mensaje:', response.data.message);
    console.log('   Token:', response.data.token.substring(0, 30) + '...');
    console.log('   Usuario:');
    console.log('     - ID:', response.data.user.id);
    console.log('     - Username:', response.data.user.username);
    console.log('     - Email:', response.data.user.email);

  } catch (error) {
    console.error(' LOGIN FALLIDO!\n');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Mensaje:', error.response.data.message);
    } else {
      console.error('   Error:', error.message);
    }
  }
}

testLogin();
