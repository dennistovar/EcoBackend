const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("\n ACTUALIZANDO AUDIOS EXISTENTES (Sin Duplicados)");

// CONFIGURACIÓN: Usamos las carpetas _normalized que creamos antes
const REGIONES = [
    //{ carpeta: 'audios_costa_normalized', folderCloud: 'ecolexico/costa' },
    { carpeta: 'audios_sierra_normalized', folderCloud: 'ecolexico/sierra' },
    //{ carpeta: 'audios_oriente_normalized', folderCloud: 'ecolexico/oriente' }
];

const actualizarRegion = async (config) => {
    const dirPath = path.join(__dirname, config.carpeta);
    if (!fs.existsSync(dirPath)) return;

    const archivos = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp3'));
    console.log(`📂 Actualizando ${config.folderCloud}...`);

    for (const archivo of archivos) {
        const palabraOriginal = archivo.replace('.mp3', ''); 

        try {
            // 1. SOLO SI EXISTE EN BD (Seguridad para no crear nuevos)
            const check = await pool.query("SELECT id FROM palabras WHERE palabra ILIKE $1", [palabraOriginal]);
            
            if (check.rows.length === 0) continue; // Si no existe, ignorar.

            // 2. REEMPLAZAR EN CLOUDINARY (overwrite: true)
            const upload = await cloudinary.uploader.upload(path.join(dirPath, archivo), {
                resource_type: "video",
                folder: config.folderCloud,
                public_id: palabraOriginal, 
                overwrite: true,   // <--- ESTO BORRA EL AUDIO VIEJO
                invalidate: true   // <--- ESTO LIMPIA LA CACHÉ
            });

            // 3. ACTUALIZAR URL EN BD (Por si acaso cambió)
            await pool.query("UPDATE palabras SET audio_url = $1 WHERE id = $2", [upload.secure_url, check.rows[0].id]);
            
            console.log(`    Actualizado: ${palabraOriginal}`);

        } catch (e) {
            console.log(`   Error: ${palabraOriginal}`);
        }
    }
};

const run = async () => {
    for (const r of REGIONES) await actualizarRegion(r);
    console.log("\n ¡AUDIOS ACTUALIZADOS CON ÉXITO!");
    pool.end();
};
run();