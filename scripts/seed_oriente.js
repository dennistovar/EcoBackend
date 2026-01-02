const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log("\n---------------------------------------------------");
console.log("🛠️  INICIANDO SCRIPT DE CARGA (ORIENTE) - VERSIÓN FINAL");
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

console.log("🔍 Verificando credenciales:");
console.log(`   - CLOUD_NAME: '${cloudName}'`); // Las comillas revelan espacios
console.log(`   - API_KEY:    '${apiKey}'`);

if (cloudName.trim() !== cloudName) {
    console.error("\n🔴 ¡ALERTA! Tienes espacios en blanco en CLOUDINARY_CLOUD_NAME.");
    console.error("👉 Ve a tu archivo .env y borra los espacios al final de 'ddezt4vi '.\n");
    process.exit(1);
}

if (apiKey.trim() !== apiKey) {
    console.error("\n🔴 ¡ALERTA! Tienes espacios en blanco en CLOUDINARY_API_KEY.");
    console.error("👉 Ve a tu archivo .env y borra los espacios al final del número.\n");
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

// 5. FUNCIÓN PRINCIPAL DE CARGA
const seedOriente = async () => {
  try {
    // Leer JSON
    const jsonPath = path.join(__dirname, 'data_oriente.json');
    if (!fs.existsSync(jsonPath)) throw new Error("No encuentro data_oriente.json");

    const rawData = fs.readFileSync(jsonPath);
    const palabras = JSON.parse(rawData);
    console.log(`📚 JSON leído correctamente. Procesando ${palabras.length} palabras...`);
    console.log("---------------------------------------------------");

    // Bucle de carga
    for (const item of palabras) {
      const audioPath = path.join(__dirname, 'audios_oriente', item.nombre_archivo);

      // Verificar si existe el audio
      if (!fs.existsSync(audioPath)) {
        console.warn(`⚠️  AVISO: Audio no encontrado: '${item.nombre_archivo}'. Saltando...`);
        continue;
      }

      console.log(`🎙️  Procesando: ${item.palabra}...`);

      // A. Subir a Cloudinary
      // Nota: Cloudinary trata audios como "video"
      const uploadResult = await cloudinary.uploader.upload(audioPath, {
        resource_type: "video", 
        folder: "ecolexico/oriente",
        public_id: item.nombre_archivo.replace('.mp3', '') // Quita la extensión para el ID
      });

      // B. Guardar en PostgreSQL
      const query = `
        INSERT INTO palabras (palabra, significado, ejemplo, audio_url, region_id, provincia_id, categoria)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;
      // Asumimos provincia_id = 1 (o null si tu tabla lo permite)
      const values = [
        item.palabra, 
        item.significado, 
        item.ejemplo, 
        uploadResult.secure_url, 
        item.region_id, 
        1,
        item.categoria || 'General'
      ];

      await pool.query(query, values);
      console.log(`   ✅ Guardado exitoso (URL: ${uploadResult.secure_url})`);
    }

    console.log("\n✨ ¡CARGA COMPLETA! Todas las palabras del Oriente están listas. ✨");

  } catch (error) {
    console.error("\n🔥 OCURRIÓ UN ERROR:", error.message);
    if (error.http_code === 401) {
        console.error("👉 Pista: El error 401 confirma que la API Key o Secret en el .env están mal copiadas.");
    }
  } finally {
    pool.end();
  }
};

// EJECUTAR
seedOriente();