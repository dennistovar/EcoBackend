const fs = require('fs');
const path = require('path');

// Clasificación de palabras por categoría
const clasificarPalabra = (palabra, significado) => {
  const sig = significado.toLowerCase();
  const pal = palabra.toLowerCase();
  
  // Food - Comida y Bebida
  if (sig.includes('food') || sig.includes('soup') || sig.includes('dish') || sig.includes('eat') || 
      sig.includes('meal') || sig.includes('plantain') || sig.includes('snack') || sig.includes('salad') ||
      pal.includes('bolón') || pal.includes('encebollado') || pal.includes('guatita') ||
      pal.includes('tigrillo') || pal.includes('viche') || pal.includes('chifle') || pal.includes('corvi') ||
      pal.includes('jama') || pal.includes('papeo') || pal.includes('once') || pal.includes('curtido') ||
      pal.includes('chichorias') || pal.includes('jamear') || pal.includes('bajón') || pal.includes('tarrinazo')) {
    return 'Food';
  }
  
  // Party - Fiestas, alcohol, celebraciones  
  if (sig.includes('party') || sig.includes('drunk') || sig.includes('beer') || sig.includes('liquor') ||
      sig.includes('drink') || sig.includes('noise') || sig.includes('gathering') ||
      pal.includes('biela') || pal.includes('bomba') || pal.includes('chupe') || pal.includes('chancuco') ||
      pal.includes('bullerengue') || pal.includes('bunde') || pal.includes('cangrejada') || pal.includes('vacilar')) {
    return 'Party';
  }
  
  // Conflicts - Conflictos, peleas, insultos, violencia
  if (sig.includes('fight') || sig.includes('beat') || sig.includes('hit') || sig.includes('angry') ||
      sig.includes('insult') || sig.includes('vulgar') || sig.includes('foul-mouthed') || sig.includes('abusive') ||
      sig.includes('troublemaker') || sig.includes('mistreat') || sig.includes('assault') || sig.includes('kill') ||
      sig.includes('rob') || sig.includes('thief') || sig.includes('confrontation') || sig.includes('gossip') ||
      pal.includes('abollar') || pal.includes('baliza') || pal.includes('baladrón') || pal.includes('buscabulla') ||
      pal.includes('carebolsa') || pal.includes('caretuco') || pal.includes('batracio') || pal.includes('bochinche') ||
      pal.includes('bochinchero') || pal.includes('boquisucio') || pal.includes('boquiflojo') || pal.includes('cabrearse') ||
      pal.includes('choro') || pal.includes('chorear') || pal.includes('chinear') || pal.includes('darse') ||
      pal.includes('dar el vire') || pal.includes('dañao') || pal.includes('diablazo') || pal.includes('emperrao') ||
      pal.includes('chillao') || pal.includes('berrinchoso') || pal.includes('bagre') || pal.includes('guacharnaco') ||
      pal.includes('sapo') || pal.includes('chanchullo')) {
    return 'Conflicts';
  }
  
  // Greetings - Saludos, cortesía, afecto
  if (sig.includes('friend') || sig.includes('affection') || sig.includes('greet') ||
      pal.includes('broder') || pal.includes('mijo') || pal.includes('jeva') || pal.includes('pelada')) {
    return 'Greetings';
  }
  
  // Expressions - Expresiones, modismos, descripciones
  if (sig.includes('expression') || sig.includes('almost') || sig.includes('little') || sig.includes('yes') ||
      sig.includes('joke') || sig.includes('appearance') || sig.includes('boasting') || sig.includes('lie') ||
      sig.includes('visit') || sig.includes('shame') || sig.includes('forgiveness') || sig.includes('mischief') ||
      sig.includes('influence') || sig.includes('scared') || sig.includes('intimidated') || sig.includes('brave') ||
      sig.includes('determined') || sig.includes('sad') || sig.includes('serious') || sig.includes('confused') ||
      sig.includes('nice') || sig.includes('excellent') || sig.includes('dangerous') || sig.includes('boring') ||
      sig.includes('slow') || sig.includes('intelligent') || sig.includes('attentive') || sig.includes('strong') ||
      sig.includes('weak') || sig.includes('ugly') || sig.includes('fat') || sig.includes('bald') || sig.includes('dirty') ||
      sig.includes('elegant') || sig.includes('sickly') || sig.includes('dominated') || sig.includes('shameless') ||
      sig.includes('peasant') || sig.includes('mestizo') || sig.includes('coastal') || sig.includes('person') ||
      sig.includes('clumsy') || sig.includes('annoying') || sig.includes('intense') || sig.includes('money') ||
      sig.includes('bribe') || sig.includes('dollar') || sig.includes('work') || sig.includes('job') ||
      sig.includes('jail') || sig.includes('police') || sig.includes('addict') || sig.includes('drug') ||
      sig.includes('sleep') || sig.includes('leave') || sig.includes('deceive') || sig.includes('help') ||
      sig.includes('show off') || sig.includes('annoy') || sig.includes('blame') || sig.includes('flirt') ||
      sig.includes('verse') || sig.includes('culture') || sig.includes('tradition') || sig.includes('head') ||
      sig.includes('full') || sig.includes('hunger') || sig.includes('shoes') || sig.includes('clothes') ||
      sig.includes('canoe') || sig.includes('stall') || sig.includes('vendor') ||
      pal.includes('casito') || pal.includes('chin') || pal.includes('posi') || pal.includes('chendo') ||
      pal.includes('bamboya') || pal.includes('aguaje') || pal.includes('paro') || pal.includes('caída') ||
      pal.includes('foco') || pal.includes('cacao') || pal.includes('diablura') || pal.includes('palanqueo') ||
      pal.includes('aculao') || pal.includes('agüevao') || pal.includes('arrecho') || pal.includes('cariacontecío') ||
      pal.includes('cariamarrao') || pal.includes('cariserio') || pal.includes('enbolatao') || pal.includes('chévere') ||
      pal.includes('candela') || pal.includes('hueso') || pal.includes('lenteja') || pal.includes('pilas') ||
      pal.includes('mosca') || pal.includes('tuco') || pal.includes('lámpara') || pal.includes('balambú') ||
      pal.includes('alfombra') || pal.includes('achacoso') || pal.includes('bambudo') || pal.includes('cocopelao') ||
      pal.includes('cocobol') || pal.includes('cochambroso') || pal.includes('encachinao') || pal.includes('colorado') ||
      pal.includes('balsoso') || pal.includes('balurdo') || pal.includes('bolsón') || pal.includes('calilla') ||
      pal.includes('cargoso') || pal.includes('desabrido') || pal.includes('gambas') || pal.includes('llanta') ||
      pal.includes('empanizao') || pal.includes('empipao') || pal.includes('lata') || pal.includes('luca') ||
      pal.includes('sota') || pal.includes('vara') || pal.includes('aceitar') || pal.includes('moje') ||
      pal.includes('billeteao') || pal.includes('culebra') || pal.includes('camello') || pal.includes('cachueliar') ||
      pal.includes('chaucha') || pal.includes('cana') || pal.includes('chirona') || pal.includes('drogo') ||
      pal.includes('puesto') || pal.includes('polla') || pal.includes('echarse') || pal.includes('ruquear') ||
      pal.includes('barajar') || pal.includes('caramelear') || pal.includes('cargarse') || pal.includes('acolitar') ||
      pal.includes('achacar') || pal.includes('banderearse') || pal.includes('abombar') || pal.includes('amorfino') ||
      pal.includes('caché') || pal.includes('cachina') || pal.includes('chuzos') || pal.includes('camaronear') ||
      pal.includes('capiro') || pal.includes('cholo') || pal.includes('montuvio') || pal.includes('coico') ||
      pal.includes('guayaco') || pal.includes('pelucón') || pal.includes('crane') || pal.includes('agachadito') ||
      pal.includes('anoa') || pal.includes('bongo') || pal.includes('bonguero') || pal.includes('chamba') ||
      pal.includes('brujo') || pal.includes('desmandar') || pal.includes('destrampar') || pal.includes('embarrar') ||
      pal.includes('embarcar') || pal.includes('embalao') || pal.includes('engrupido') || pal.includes('encanao') ||
      pal.includes('chantar') || pal.includes('charlón') || pal.includes('chiro') || pal.includes('pitear') ||
      pal.includes('salsero') || pal.includes('sapada') || pal.includes('ñengoso') || pal.includes('bartolo') ||
      pal.includes('boquear')) {
    return 'Expressions';
  }
  
  return 'General';
};

const actualizarJSON = async () => {
  try {
    const jsonPath = path.join(__dirname, 'scripts', 'data_costa.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const palabras = JSON.parse(rawData);
    
    console.log(`📚 Procesando ${palabras.length} palabras...\n`);
    
    const palabrasActualizadas = palabras.map((item, index) => {
      const categoria = clasificarPalabra(item.palabra, item.significado);
      
      if ((index + 1) % 20 === 0) {
        console.log(` Procesadas ${index + 1} palabras...`);
      }
      
      return {
        ...item,
        categoria
      };
    });
    
    // Guardar el archivo actualizado
    fs.writeFileSync(jsonPath, JSON.stringify(palabrasActualizadas, null, 2), 'utf8');
    
    console.log(`\n ¡Archivo actualizado exitosamente!`);
    console.log(` Total de palabras: ${palabrasActualizadas.length}`);
    
    // Mostrar estadísticas de categorías
    const categorias = {};
    palabrasActualizadas.forEach(item => {
      categorias[item.categoria] = (categorias[item.categoria] || 0) + 1;
    });
    
    console.log('\n Distribución por categorías:');
    Object.entries(categorias)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} palabras`);
      });
    
  } catch (error) {
    console.error(' Error:', error.message);
  }
};

actualizarJSON();
