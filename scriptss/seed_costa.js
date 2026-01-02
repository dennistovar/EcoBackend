const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log("\n---------------------------------------------------");
console.log("🌊 INICIANDO SCRIPT DE CARGA (COSTA) - MODO SEGURO");
console.log("---------------------------------------------------");

// 1. CARGAR Y VERIFICAR .ENV
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("✅ Archivo .env cargado.");
} else {
    console.error("❌ ERROR FATAL: No encuentro el archivo .env en:", envPath);
    process.exit(1);
}

// 2. DETECTOR DE ESPACIOS (ANTI-ERROR 401)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

// Validamos que no haya espacios en blanco traicioneros
if (cloudName.trim() !== cloudName || apiKey.trim() !== apiKey) {
    console.error("\n🔴 ¡ALERTA! Tienes espacios en blanco en tu archivo .env");
    console.error("👉 Revisa CLOUDINARY_CLOUD_NAME y CLOUDINARY_API_KEY y borra los espacios al final.\n");
    process.exit(1);
}

// 3. CONFIGURAR CLOUDINARY
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// 4. CONFIGURAR BASE DE DATOS
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 5. FUNCIÓN PRINCIPAL DE CARGA COSTA
const seedCosta = async () => {
  try {
    // A. Leer JSON de la COSTA
    const jsonPath = path.join(__dirname, 'data_costa.json');
    
    if (!fs.existsSync(jsonPath)) {
        throw new Error("❌ No encuentro el archivo 'data_costa.json'. Asegúrate de haberlo creado.");
    }

    const rawData = fs.readFileSync(jsonPath);
    const palabras = JSON.parse(rawData);
    console.log(`📚 JSON leído correctamente. Revisando ${palabras.length} palabras de la COSTA...`);
    console.log("---------------------------------------------------");

    // B. Bucle de carga
    for (const item of palabras) {
      const audioPath = path.join(__dirname, 'audios_costa', item.nombre_archivo);

      // --- PASO CLAVE: VERIFICAR SI YA EXISTE EN BD ---
      // Esto evita que se dupliquen si corres el script 2 veces
      const checkQuery = 'SELECT id FROM palabras WHERE palabra = $1';
      const checkResult = await pool.query(checkQuery, [item.palabra]);

      if (checkResult.rows.length > 0) {
          console.log(`⏩ Saltando '${item.palabra}' (Ya existe en la Base de Datos).`);
          continue; // Pasa a la siguiente palabra inmediatamente
      }
      // -----------------------------------------------

      // Verificar si existe el audio físico
      if (!fs.existsSync(audioPath)) {
        console.warn(`⚠️  AVISO: Audio no encontrado en carpeta: '${item.nombre_archivo}'. Saltando...`);
        continue;
      }

      console.log(`🎙️  Subiendo nueva palabra: ${item.palabra}...`);

      // C. Subir a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(audioPath, {
        resource_type: "video", 
        folder: "ecolexico/costa", // Carpeta en la nube para Costa
        public_id: item.nombre_archivo.replace('.mp3', '')
      });

      // D. Guardar en PostgreSQL
      const query = `
        INSERT INTO palabras (palabra, significado, ejemplo, audio_url, region_id, provincia_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
      
      // Asegúrate de que el region_id en tu JSON sea el correcto (Ej: 1 para Costa, 2 Sierra, 3 Oriente)
      // Si no viene en el JSON, puedes forzarlo cambiando item.region_id por el número, ej: 1
      const values = [item.palabra, item.significado, item.ejemplo, uploadResult.secure_url, item.region_id, 1];

      await pool.query(query, values);
      console.log(`   ✅ Guardado exitoso (URL Cloudinary generada)`);
    }

    console.log("\n✨ ¡PROCESO FINALIZADO! Tu base de datos está al día. ✨");

  } catch (error) {
    console.error("\n🔥 OCURRIÓ UN ERROR:", error.message);
  } finally {
    pool.end();
  }
};

// EJECUTAR
seedCosta();