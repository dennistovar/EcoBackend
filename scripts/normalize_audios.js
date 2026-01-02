const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

console.log("🎚️  INICIANDO NORMALIZACIÓN DE AUDIOS...");

// TUS CARPETAS ACTUALES
const carpetas = ['audios_oriente']; 

const procesarCarpeta = async (nombreCarpeta) => {
    const inputDir = path.join(__dirname, nombreCarpeta);
    const outputDir = path.join(__dirname, `${nombreCarpeta}_normalized`); // Carpeta nueva

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if (!fs.existsSync(inputDir)) return;

    const archivos = fs.readdirSync(inputDir).filter(f => f.endsWith('.mp3'));
    console.log(`📂 Procesando ${nombreCarpeta}: ${archivos.length} archivos.`);

    let procesados = 0;
    for (const archivo of archivos) {
        await new Promise((resolve) => {
            ffmpeg(path.join(inputDir, archivo))
                // Filtro estándar para volumen profesional
                .audioFilters('loudnorm=I=-16:TP=-1.5:LRA=11') 
                .save(path.join(outputDir, archivo))
                .on('end', () => {
                    procesados++;
                    process.stdout.write(`\r   ✅ ${procesados}/${archivos.length}`);
                    resolve();
                })
                .on('error', () => resolve()); // Si falla uno, sigue con el otro
        });
    }
    console.log(`\n   ✨ Carpeta ${nombreCarpeta} lista.\n`);
};

const run = async () => {
    for (const c of carpetas) await procesarCarpeta(c);
};
run();