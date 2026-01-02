const fs = require('fs');
const path = require('path');

// Clasificación de palabras por categoría para Oriente (Amazon Region)
const clasificarPalabra = (palabra, significado) => {
  const sig = significado.toLowerCase();
  const pal = palabra.toLowerCase();
  
  // Nature - Naturaleza, animales, plantas, geografía
  if (sig.includes('animal') || sig.includes('bird') || sig.includes('fish') || sig.includes('tree') ||
      sig.includes('plant') || sig.includes('forest') || sig.includes('river') || sig.includes('jungle') ||
      sig.includes('snake') || sig.includes('serpent') || sig.includes('swamp') || sig.includes('wetland') ||
      sig.includes('mountain') || sig.includes('lagoon') || sig.includes('palm') || sig.includes('fruit') ||
      sig.includes('flower') || sig.includes('leaf') || sig.includes('insect') || sig.includes('butterfly') ||
      sig.includes('monkey') || sig.includes('jaguar') || sig.includes('parrot') || sig.includes('toucan') ||
      sig.includes('anaconda') || sig.includes('caiman') || sig.includes('dolphin') || sig.includes('piranha') ||
      sig.includes('vine') || sig.includes('root') || sig.includes('seed') || sig.includes('water') ||
      sig.includes('rain') || sig.includes('canopy') || sig.includes('wilderness') || sig.includes('nature') ||
      pal.includes('aña') || pal.includes('aguajal') || pal.includes('amasanga') || pal.includes('yasuní') ||
      pal.includes('huangana') || pal.includes('guanta') || pal.includes('sacha') || pal.includes('yuca') ||
      pal.includes('chonta') || pal.includes('ungurahua') || pal.includes('morete')) {
    return 'Nature';
  }
  
  // Traditions - Cultura, tradiciones, espiritualidad, ceremonias
  if (sig.includes('spirit') || sig.includes('sacred') || sig.includes('ceremony') || sig.includes('ritual') ||
      sig.includes('shaman') || sig.includes('prayer') || sig.includes('song') || sig.includes('tradition') ||
      sig.includes('indigenous') || sig.includes('tribal') || sig.includes('ancestral') || sig.includes('myth') ||
      sig.includes('legend') || sig.includes('celebration') || sig.includes('dance') || sig.includes('music') ||
      sig.includes('cultural') || sig.includes('belief') || sig.includes('spiritual') || sig.includes('divine') ||
      sig.includes('healer') || sig.includes('medicine man') || sig.includes('blessing') || sig.includes('offering') ||
      pal.includes('achuar') || pal.includes('shuar') || pal.includes('huaorani') || pal.includes('kichwa') ||
      pal.includes('anent') || pal.includes('apachita') || pal.includes('ayahuasca') || pal.includes('iwia') ||
      pal.includes('tsantsa') || pal.includes('natemamu') || pal.includes('yachak')) {
    return 'Traditions';
  }
  
  // Gastronomy - Comida, bebida, cocina, preparación de alimentos
  if (sig.includes('food') || sig.includes('dish') || sig.includes('meal') || sig.includes('eat') ||
      sig.includes('drink') || sig.includes('beverage') || sig.includes('soup') || sig.includes('stew') ||
      sig.includes('roast') || sig.includes('cooked') || sig.includes('fried') || sig.includes('boiled') ||
      sig.includes('wrap') || sig.includes('bread') || sig.includes('chicha') || sig.includes('fermented') ||
      sig.includes('grilled') || sig.includes('smoked') || sig.includes('cuisine') || sig.includes('recipe') ||
      sig.includes('cooking') || sig.includes('plate') || sig.includes('serve') ||
      pal.includes('maito') || pal.includes('chicha') || pal.includes('guayusa') || pal.includes('wayusa') ||
      pal.includes('ceviche') || pal.includes('chontacuro') || pal.includes('casabe') || pal.includes('patarashca')) {
    return 'Gastronomy';
  }
  
  // Daily Life - Vida diaria, trabajo, actividades cotidianas, objetos, herramientas
  if (sig.includes('to ') || sig.includes('house') || sig.includes('hut') || sig.includes('canoe') ||
      sig.includes('basket') || sig.includes('tool') || sig.includes('weapon') || sig.includes('clothing') ||
      sig.includes('path') || sig.includes('village') || sig.includes('community') || sig.includes('work') ||
      sig.includes('fishing') || sig.includes('hunting') || sig.includes('farming') || sig.includes('daily') ||
      sig.includes('everyday') || sig.includes('activity') || sig.includes('task') || sig.includes('job') ||
      sig.includes('blow dart') || sig.includes('spear') || sig.includes('bow') || sig.includes('arrow') ||
      sig.includes('pottery') || sig.includes('craft') || sig.includes('weaving') || sig.includes('bring') ||
      sig.includes('carry') || sig.includes('walk') || sig.includes('go') || sig.includes('come') ||
      pal.includes('apamuy') || pal.includes('cerbatana') || pal.includes('shigra') || pal.includes('pilche') ||
      pal.includes('curare') || pal.includes('barbasco') || pal.includes('canoa')) {
    return 'Daily Life';
  }
  
  return 'General';
};

const actualizarJSON = async () => {
  try {
    const jsonPath = path.join(__dirname, 'scripts', 'data_oriente.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const palabras = JSON.parse(rawData);
    
    console.log(`📚 Procesando ${palabras.length} palabras del Oriente...\n`);
    
    const palabrasActualizadas = palabras.map((item, index) => {
      const categoria = clasificarPalabra(item.palabra, item.significado);
      
      if ((index + 1) % 20 === 0) {
        console.log(`✅ Procesadas ${index + 1} palabras...`);
      }
      
      return {
        ...item,
        categoria
      };
    });
    
    // Guardar el archivo actualizado
    fs.writeFileSync(jsonPath, JSON.stringify(palabrasActualizadas, null, 2), 'utf8');
    
    console.log(`\n✅ ¡Archivo actualizado exitosamente!`);
    console.log(`📊 Total de palabras: ${palabrasActualizadas.length}`);
    
    // Mostrar estadísticas de categorías
    const categorias = {};
    palabrasActualizadas.forEach(item => {
      categorias[item.categoria] = (categorias[item.categoria] || 0) + 1;
    });
    
    console.log('\n📋 Distribución por categorías:');
    Object.entries(categorias)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} palabras`);
      });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

actualizarJSON();
