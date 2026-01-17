const fs = require('fs');
const path = require('path');

// Clasificación de palabras de la SIERRA por categoría
const clasificarPalabra = (palabra, significado) => {
  const sig = significado.toLowerCase();
  const pal = palabra.toLowerCase();
  
  // Food - Comida y Bebida
  if (sig.includes('food') || sig.includes('soup') || sig.includes('dish') || sig.includes('eat') || 
      sig.includes('meal') || sig.includes('corn') || sig.includes('snack') || sig.includes('drink') ||
      sig.includes('ice cream') || sig.includes('sweet') || sig.includes('tamale') ||
      pal.includes('canguil') || pal.includes('chocho') || pal.includes('choclo') || 
      pal.includes('chugchucara') || pal.includes('chulpi') || pal.includes('colada') ||
      pal.includes('cucayo') || pal.includes('fondearse') || pal.includes('humita') ||
      pal.includes('jialar') || pal.includes('mishqui') || pal.includes('morocho') ||
      pal.includes('sorbete') || pal.includes('yucho') || pal.includes('arrarray')) {
    return 'Food';
  }
  
  // Party - Fiestas, alcohol, celebraciones  
  if (sig.includes('party') || sig.includes('drunk') || sig.includes('beer') || sig.includes('liquor') ||
      sig.includes('drink') || sig.includes('hangover') || sig.includes('celebration') || sig.includes('high') ||
      pal.includes('biela') || pal.includes('chumado') || pal.includes('chumarse') || 
      pal.includes('chuchaqui') || pal.includes('farra') || pal.includes('goma') ||
      pal.includes('guaro') || pal.includes('pacheco') || pal.includes('relajo') || 
      pal.includes('vacilar')) {
    return 'Party';
  }
  
  // Conflicts - Conflictos, peleas, insultos, violencia
  if (sig.includes('fight') || sig.includes('beat') || sig.includes('hit') || sig.includes('angry') ||
      sig.includes('insult') || sig.includes('rude') || sig.includes('shameless') || sig.includes('betrayal') ||
      sig.includes('thief') || sig.includes('snitch') || sig.includes('annoy') || sig.includes('cheat') ||
      sig.includes('troublemaker') || sig.includes('punishment') ||
      pal.includes('afrentoso') || pal.includes('chaqueta') || pal.includes('chirlazo') ||
      pal.includes('choro') || pal.includes('cocolón') || pal.includes('huaso') ||
      pal.includes('poner los cachos') || pal.includes('sacar la piedra') || pal.includes('sapo') ||
      pal.includes('soplar') || pal.includes('tunda')) {
    return 'Conflicts';
  }
  
  // Greetings - Saludos, cortesía, afecto, familia, amigos
  if (sig.includes('friend') || sig.includes('buddy') || sig.includes('girlfriend') || sig.includes('child') ||
      sig.includes('baby') || sig.includes('young person') || sig.includes('kid') || sig.includes('father') ||
      sig.includes('brother') || sig.includes('parent') ||
      pal.includes('chamo') || pal.includes('cucho') || pal.includes('guagua') ||
      pal.includes('guambra') || pal.includes('jeva') || pal.includes('llave') ||
      pal.includes('man') || pal.includes('mashi') || pal.includes('pana') ||
      pal.includes('pelado') || pal.includes('taita') || pal.includes('ñaño')) {
    return 'Greetings';
  }
  
  // Expressions - Expresiones, modismos, descripciones
  if (sig.includes('expression') || sig.includes('exclamation') || sig.includes('cold') || sig.includes('yes') ||
      sig.includes('smart') || sig.includes('cool') || sig.includes('great') || sig.includes('excellent') ||
      sig.includes('scared') || sig.includes('naked') || sig.includes('broke') || sig.includes('money') ||
      sig.includes('work') || sig.includes('house') || sig.includes('head') || sig.includes('appearance') ||
      sig.includes('peasant') || sig.includes('indigenous') || sig.includes('mestizo') ||
      sig.includes('wind') || sig.includes('altitude') || sig.includes('simple') || sig.includes('foolish') ||
      sig.includes('weak') || sig.includes('curly') || sig.includes('bald') || sig.includes('disheveled') ||
      sig.includes('blond') || sig.includes('old') || sig.includes('worn') || sig.includes('crooked') ||
      sig.includes('understand') || sig.includes('skip') || sig.includes('fall in love') || sig.includes('kiss') ||
      sig.includes('flirt') || sig.includes('park') || sig.includes('fit') || sig.includes('escape') ||
      sig.includes('pay attention') || sig.includes('call') || sig.includes('tell') || sig.includes('help') ||
      sig.includes('coward') || sig.includes('underwear') || sig.includes('sweater') || sig.includes('bag') ||
      sig.includes('wallet') || sig.includes('cigarette') || sig.includes('lock') || sig.includes('police') ||
      sig.includes('connection') || sig.includes('influence') || sig.includes('rumor') || sig.includes('gossip') ||
      sig.includes('suddenly') || sig.includes('definitely') || sig.includes('thing') || sig.includes('stuff') ||
      sig.includes('strength') || sig.includes('energy') || sig.includes('mischievous') || sig.includes('childish') ||
      sig.includes('in love') || sig.includes('precious') || sig.includes('sarcastic') || sig.includes('disgust') ||
      sig.includes('hot') || sig.includes('spicy') || sig.includes('tomboy') || sig.includes('masculine') ||
      sig.includes('messy') || sig.includes('dirty') || sig.includes('curl') || sig.includes('beautiful') ||
      sig.includes('belly') || sig.includes('navel') || sig.includes('grimace') || sig.includes('face') ||
      sig.includes('emphasis') || sig.includes('trouble') || sig.includes('heart') || sig.includes('please') ||
      sig.includes('traffic') || sig.includes('bus') || sig.includes('transport') ||
      pal.includes('achachay') || pal.includes('acolitar') || pal.includes('aisito') ||
      pal.includes('alhaja') || pal.includes('amartelado') || pal.includes('aniñado') ||
      pal.includes('atatay') || pal.includes('bacán') || pal.includes('cachar') ||
      pal.includes('calzón') || pal.includes('camello') || pal.includes('carishina') ||
      pal.includes('chagra') || pal.includes('chaguarquero') || pal.includes('chapa') ||
      pal.includes('chauchera') || pal.includes('chiro') || pal.includes('cholo') ||
      pal.includes('chompa') || pal.includes('chulla') || pal.includes('churo') ||
      pal.includes('colgar') || pal.includes('cutzu') || pal.includes('de ley') ||
      pal.includes('desgreñado') || pal.includes('ele') || pal.includes('embonar') ||
      pal.includes('empelotado') || pal.includes('encamotar') || pal.includes('enchufar') ||
      pal.includes('escurre') || pal.includes('foco') || pal.includes('frito') ||
      pal.includes('gara') || pal.includes('gaso') || pal.includes('guin gui') ||
      pal.includes('guincho') || pal.includes('hacerse la vaca') || pal.includes('huaira') ||
      pal.includes('jato') || pal.includes('lliguis') || pal.includes('llucho') ||
      pal.includes('longo') || pal.includes('lámpara') || pal.includes('macanudo') ||
      pal.includes('mate') || pal.includes('mijin') || pal.includes('motoso') ||
      pal.includes('muchar') || pal.includes('mushpa') || pal.includes('no sea malito') ||
      pal.includes('parar bola') || pal.includes('parquear') || pal.includes('pastuso') ||
      pal.includes('pele') || pal.includes('pico') || pal.includes('pinta') ||
      pal.includes('pite') || pal.includes('pucho') || pal.includes('pupo') ||
      pal.includes('quiño') || pal.includes('rosca') || pal.includes('ruco') ||
      pal.includes('run run') || pal.includes('safa') || pal.includes('shigra') ||
      pal.includes('shungo') || pal.includes('simon') || pal.includes('simplón') ||
      pal.includes('sobar') || pal.includes('sopetón') || pal.includes('soroche') ||
      pal.includes('suco') || pal.includes('sunsho') || pal.includes('taco') ||
      pal.includes('tener el diablo') || pal.includes('testa') || pal.includes('timbrar') ||
      pal.includes('tirar') || pal.includes('tonga') || pal.includes('trole') ||
      pal.includes('témpano') || pal.includes('tímbrame') || pal.includes('vaina') ||
      pal.includes('ve') || pal.includes('viringo') || pal.includes('visaje') ||
      pal.includes('yala') || pal.includes('yapa') || pal.includes('ñeque')) {
    return 'Expressions';
  }
  
  return 'General';
};

const actualizarJSON = async () => {
  try {
    const jsonPath = path.join(__dirname, '../data_sierra.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const palabras = JSON.parse(rawData);
    
    console.log(`📚 Procesando ${palabras.length} palabras de la SIERRA...\n`);
    
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
    
    console.log(`\n✨ ¡Archivo actualizado exitosamente!`);
    console.log(`📊 Total de palabras: ${palabrasActualizadas.length}`);
    
    // Mostrar estadísticas de categorías
    const categorias = {};
    palabrasActualizadas.forEach(item => {
      categorias[item.categoria] = (categorias[item.categoria] || 0) + 1;
    });
    
    console.log('\n📈 Distribución por categorías:');
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
