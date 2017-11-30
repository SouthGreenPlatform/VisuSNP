var id = 0;  //Compteur de nombre de track
var outerTrackWidth = 0.2; // Valeur globale pour init la taille du circos et des track
var innerTrackWidth = 0.1;  // Same
var innerStart = 1; //Valeur a partir de laquelle les track seront dessinees en interieur
var outerStart = 1.2; // Valeur a partir de laquelle les track seront dessinnees en exterieur
var max=0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000001; //because
var min=0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000001; //you know...
var totallength = 0;
var options = ["Chords","HighLight","Line","HeatMap","Scatter","Histogram","Stack","Text"]; //Tout les types de track stockées dans un tableau pour le tri

//Init de la var width pour afin de déterminer la largeur du graphe s'adapte a la largeur de la page au premier chargement 4 
var width = document.getElementsByClassName('circoscontainer')[0].offsetWidth

//Creation de l'instance circos et def de la div dans laquelle il va aller 
var circos = new Circos({
  container: '#lineChart', 
  width: width,
  height: width
})

var chromosomeData = []; //Tableau qui va contenir les données chromosomes

//evite de reload le circos a chaque fois
var loaded = false;

//Couleurs des cytobands
var gieStainColor = {
  gpos100: 'rgb(0,0,0)',
  gpos: 'rgb(0,0,0)',
  gpos75: 'rgb(130,130,130)',
  gpos66: 'rgb(160,160,160)',
  gpos50: 'rgb(200,200,200)',
  gpos33: 'rgb(210,210,210)',
  gpos25: 'rgb(200,200,200)',
  gvar: 'rgb(220,220,220)',
  gneg: 'rgb(255,255,255)',
  acen: 'rgb(217,47,39)',
  stalk: 'rgb(100,127,164)',
  select: 'rgb(135,177,255)'
}
var inversions = []; //Je ne peux pas être plus clair

var button = document.getElementById("newTrackButton"); //Ajoute l'evenet permettant d'ajouter une track au clic sur le bouton add new track
button.setAttribute("onclick","addNewTrack()");

document.getElementById("titleMeh").innerHTML = randomName(); //Génére un nom random pour la page XDLOL des barres et des caffées

//BEGIN de la Fonction BackToTop
jQuery(document).ready(function($){
  // browser window scroll (in pixels) after which the "back to top" link is shown
  var offset = 300,
  //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
  offset_opacity = 1200,
  //duration of the top scrolling animation (in ms)
  scroll_top_duration = 700,
  //grab the "back to top" link
  $back_to_top = $('.cd-top');
  $back_to_top.hide()

  //hide or show the "back to top" link
  $(window).scroll(function(){
    ( $(this).scrollTop() > offset ) ? $back_to_top.show() : $back_to_top.hide();
    if( $(this).scrollTop() > offset_opacity ) { 
      $back_to_top.addClass('cd-fade-out');
    }
  });

  //smooth scroll to top
  $back_to_top.on('click', function(event){
    event.preventDefault();
    $('body,html').animate({
      scrollTop: 0 ,
    }, scroll_top_duration
    );
  });
});
//END de la fonction back to top















// ----------------------------- PARTIE PARSEURS ------------------------------ //

//Parse les chromosomes et les stocke dans une variable globale
function chromosomeParser(data){
  chromosomeData = []; //Init le tableau Chromosome data a null
  var split = data.split("\n"); //definit le separateur de chaque ligne par un retour a la ligne et cree un tableau dans split qui va être parcouru par la suite
  var localsplit  = "";
  var localchr="";
  
  for (var i = 0; i < split.length; i++) { //Pour chaque ligne du tableau split 
    localsplit = split[i].split(" ");      //On va créer un tableau de la ligne avec en séparateur un espace
    var color;

    //Boucle qui vérifie si l'utilisateur lui passe une couleur en paramètre
    if(localsplit[2] == undefined){       
      color = "#272727";
    }else{
      color = localsplit[2];
    }
    //La boucle normale qui crée les objets
    if (localsplit[1]>1)
    {
      if(loaded == false){
        populateSelect(localsplit[0]);
        $('#patateorange').click(function(event){
         event.stopPropagation();
       });
      }
      localchr = {
        id : localsplit[0],
        label : localsplit[0],
        len : parseInt(localsplit[1]),
        color : color
      }
      chromosomeData.push(localchr);
    }
  }
  //Fonction qui permet d'avoir le select multiple 
  if(loaded == false){
    $("#selectChr").mousedown(function(e){
      e.preventDefault();
      var select = this;
      var scroll = select.scrollTop;
      e.target.selected = !e.target.selected;
      setTimeout(function(){select.scrollTop = scroll;}, 0); 
      $(select).focus();
    }).mousemove(function(e){e.preventDefault()});
  }
  loaded = true;
  chromosomeData = triChr(chromosomeData);
  return chromosomeData;
}

//Fonction qui permet de trier les chromosomes (Utile pour le select de chromosomes spécifiques)
function triChr(data){
  var sorting = getSelectedChromosomes();
  var result = []
  if (getSelectedChromosomes().length>0){
    sorting.forEach(function(key) {
      console.log("Key " +key);

      data.forEach(function(datum) {
        if(datum.id == key) {
          console.log("la")
          result.push(datum);
        }
      })
    })
  }
  else{
    return data;
  }
  return result;
}

//Pends des fichiers au format Chr debut fin valeur
//Utile pour HeatMap, Linen, scatter
function scatterParser(data){
  var array = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    if (parseInt(localsplit[1]) >= 0){
      localchr = {
        chromosome : localsplit[0],
        start : parseInt(localsplit[1]),
        value : localsplit[2] 
      }
    }
    //
    array.push(localchr);
  }
  return array;
}

//Retourne la longeur du chromosome demandé en param
function getChromosomeLength(chromosome){
  for(var i = 0;i<chromosomeData.length;i++){
    if(chromosomeData[i].id == chromosome){
      return chromosomeData[i].len;
    }
  }
}

//Fonctioin un peu particulière car le nombre de valeurs pouvant être variables on a du adapter le code avec la valeur xlength
function heatmapParser(data){
  var array = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  var xlength = split[0].split(" ");
  for(var xl = 0;xl<xlength.length-2;xl++){
    array[xl]=new Array();
  }
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    for(var n = 2; n<localsplit.length; n++){
      var next;
      if(split[i+1] !== undefined){
        next = split[i+1].split(" ")[1];
        if(next == 0){
          next = getChromosomeLength(localsplit[0]);
        }
      }
      else{
        next = getChromosomeLength(localsplit[0]);
      }
      localchr = {
        chromosome : localsplit[0],
        start : parseInt(localsplit[1]),
        end : parseInt(next),
        value : localsplit[n] 
      }
      array[n-2].push(localchr);
    }
  }
  return array;
}

//Same as heatmap
function lineParser(data){
  max=0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000001;
  min=0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000001;
  var array = [];
  var split = data.split("\n"); //ligne de data
  var localsplit  = "";
  var localchr="";
 // console.log("split0 " +split[1825] + "split " + split[1825].split( ));
  var xlength = split[0].split(" "); //découpe la première ligne
  //créé un tableau
  for(var xl = 0;xl<xlength.length-2;xl++){
    array[xl]=new Array();
  }
 // console.log("split length " +split.length);
  for (var i = 0; i < split.length; i++) { //pour chaque ligne
    localsplit = split[i].split(" ");     //découpe la ligne
    for(var n = 2; n<localsplit.length; n++){ 
       var value_to_affect = localsplit[n] * 10; ////////////////valeurs multipliées pour ne pas atteindre le palier d'affichage
       ///////////////////
      localchr = {                        
        chromosome : localsplit[0],      //nom du chr
        start : parseInt(localsplit[1]), //position
        ///////////////////////////
        //value : localsplit[n]             //valeur
         value : value_to_affect
         //////////////////////////
      }
      if(parseFloat(localsplit[n])>max){          //test valeur max
        max=parseFloat(localsplit[n]);
      }
      if(parseFloat(localsplit[n])<min){          //test valeur min
        min=parseFloat(localsplit[n]);
      }
      array[n-2].push(localchr);      
    }
  }
  return array;
}

//Parser pour les cytobands
function cytobandsParser(data){
  var array = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    localchr = {
      chromosome : localsplit[0],
      start : parseInt(localsplit[1]),
      end : parseInt(localsplit[2]),
      name : localsplit[3],
      gieStain : localsplit[4] 
    }
    //
    array.push(localchr);
  }
  return array;
}

//Parser for Chords
function chordsParser(data){
  var chords = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    if(((localsplit[1]>localsplit[2]) && (localsplit[4]<localsplit[5])) || ((localsplit[1]<localsplit[2]) && (localsplit[4]>localsplit[5]))){ //Condition qui permet de voir si c'est une inversion ou non
      localchr = {
        source : localsplit[0],
        source_start : parseInt(localsplit[1]),
        source_end : parseInt(localsplit[2]),
        target : localsplit[3],
        target_start : parseInt(localsplit[4]),
        target_end : parseInt(localsplit[5]),
        source_label : localsplit[0],
        target_label : localsplit[3]
      }
      inversions.push(localchr);
    }else{
      localchr = {
        source : localsplit[0],
        source_start : parseInt(localsplit[1]),
        source_end : parseInt(localsplit[2]),
        target : localsplit[3],
        target_start : localsplit[4],
        target_end : parseInt(localsplit[5]),
        source_label : parseInt(localsplit[0]),
        target_label : localsplit[3]
      }
      chords.push(localchr);
    }
  }
  return chords;
}

//Histogram Parser
function histogramParser(data){
  chromosomeData = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  var chromStart=0;

  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");

    //taille min de end - start = 50000 pour etre visible

    localchr = {
      block_id : localsplit[0],
      start : parseInt(localsplit[1]),
      end : parseInt(localsplit[1]) + parseInt("50000"),
      value : parseInt(localsplit[3])
    }

    chromosomeData.push(localchr);
   // console.log("block_id <"+localsplit[0]+"> start <"+parseInt(localsplit[1])+"> end <"+parseInt(localsplit[2])+"> value <"+parseInt(localsplit[3])+">\n");

  }
  return chromosomeData;
}

/*//Stack Parser
function stackParser(data){
  var array = [];
  var split = data.split("\n");
  var localsplit  = "";
  var localchr="";
  var array_indiv = [];
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");alert(localsplit[4]);
    localchr = {
      chr : localsplit[0],
      start : parseInt(localsplit[1]),
      end : parseInt(localsplit[2]),
      color : localsplit[3],
      indiv : localsplit[4]
    }
    array_indiv.push(localsplit[4]);
    array.push(localchr);
  }
  alert(array_indiv.length);
  return array;
}*/

//Stack Parser
function stackParser(data,individu){
  var array = [];
  var split = data.split("\n");
  var localsplit = "";
  var localchr="";
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    if (individu == localsplit[4]){
	    localchr = {
	      chr : localsplit[0],
	      start : parseInt(localsplit[1]),
	      end : parseInt(localsplit[2]),
	      color : localsplit[3],
	      indiv : localsplit[4]
    		}
	    array.push(localchr);
	}
  }
  return array;
}

//Stack Parser
function stackParser2(data){
  var array = [];
  var split = data.split("\n");
  var localsplit = "";
  var localchr="";
  var h = new Object();
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    localchr = {
      chr : localsplit[0],
      start : parseInt(localsplit[1]),
      end : parseInt(localsplit[2]),
      color : localsplit[3],
      indiv : localsplit[4]
    }
    array.push(localchr);
    h[localsplit[4]]=array;
  }
  return h;
}


// ----------------------------- FIN PARTIE PARSEURS ------------------------------ //











// ----------------------------- PARTIE GENERATION DE CONFIG ------------------------------ //
/*Pour cette partie les fonctions peuvent être modifiees dans le sens ou on peut lui passer plus ou moins de paramètres suivant le niveau de personnalisation que l'on veut avoir
il suffira juste d'ajouter la valeur dans la fonction load_circos. C'est valable pour toutes les fonctions de config*/

//Configuration du layout
function layoutConfig(spacing,suffix){
  var layout = {
    innerRadius: 295,
    outerRadius: 300,
    cornerRadius: 10,
    gap: 0.04,
    labels: {
      display: true,
      size : 30,
      position : 'center',
      radialOffset : 20
    },
    ticks: {
      //def 6000000
      spacing: spacing,
      //def Mb
      labelSuffix: suffix,
      labelDenominator: 1000000,
      display: true,
      labelDisplay0: true,
      labelSize: 13,
      labelSpacing: 10,
      labelColor: '#000000',
      labelFont: 'default',
      majorSpacing: 5,
      size: {
        minor: 2,
        major: 5,
      }
    }
  }
  return layout;
}

//Configuration des HeatMap 
/*Cette dernière prends en paramètre le nombre de heatmap, afin de calculer la taille de cette dernière, car il peut y avoir plusieurs valeurs et du coup la track peut être divisé en N heatmap*/
function heatmapConfig(position,color,orientation,heatmapcount,heatmapsize,trackname){
  if(orientation == "out"){
    var tracksize = outerTrackWidth/heatmapcount;
    var radius = outerStart + (position * 0.22)+(heatmapsize*tracksize);
    var innerRad = radius;
    var outerRadius = radius + tracksize
  }else{
    var tracksize = outerTrackWidth/heatmapcount;
    var radius = innerStart - (position * 0.12)+(heatmapsize*tracksize);
    var outerRadius = radius;
    var innerRad = radius - tracksize
  }
  var heatmap = {
    innerRadius: innerRad,
    outerRadius: outerRadius,
    logScale: false,
    tooltipContent: function (d) {
        return trackname + ":<br/>" + d.start + '-' + d.end + ': ' + d.value
      },
    color: color
  }
  return heatmap;
}

//Configuration des Chord
function chordConfig(option){
  if(option == "1"){
    var chord = {
      logScale: false,
      opacity: 0.7,
      color: '#ff5722',
      tooltipContent: function (d) {
        return '<h3>' + d.source.id + ' > ' + d.target.id + ': ' + d.value + '</h3><i>(CTRL+C to copy to clipboard)</i>';
      }
    }
  }
  else{
    var chord = {
      logScale: false,
      opacity: 0.7,
      color: '#1f52a5',
      tooltipContent: function (d) {
        return '<h3>' + d.source.id + ' > ' + d.target.id + ': ' + d.value + '</h3><i>(CTRL+C to copy to clipboard)</i>';
      }
    }
  }
  return chord;
}

//Configuration des Line
function lineConfig(position,orientation, number,trackname){
  var direction;
  var fill = true;
  if(number >1){
    var fill = false
  }
  if(orientation == "out"){
    direction = "in"
    var radius = outerStart + (position * 0.22) //écart
    var innerRad = radius + outerTrackWidth //Largeur
  }else{
    direction = "out";
    var radius = innerStart - (position * 0.12);
    var innerRad = radius - innerTrackWidth
  }
  
  var line = {
    innerRadius: innerRad,
    outerRadius: radius,
    maxGap: 1000000,
    fill : fill,
    strokeColor: '#272727',
    direction : direction,
    color: randomColor(),
    tooltipContent: function (d) {
        return trackname
      }, 
    axes: [
    {
      spacing: 100000000000000000000000000000000000,
      thickness: 1,
      color: '#666666'
    }]
  }
  //console.log("Max line " +max);
  return line
}

//Configuration du scatter invisible qui va venir par dessus la track line affin de permettre le clic
function lineScatterConfig(position,orientation,trackname){
 var direction;
 if(orientation == "out"){
  direction = "in"
    var radius = outerStart + (position * 0.22) //écart
    var innerRad = radius + outerTrackWidth //Largeur
  }else{
    direction = "out";
    var radius = innerStart - (position * 0.12);
    var innerRad = radius - innerTrackWidth
  }
  var line = {
    innerRadius: innerRad,
    outerRadius: radius,
    maxGap: 1000000,
    direction :direction,
    strokeWidth : 40,
    fill: false,
    strokeWidth: 0,
    tooltipContent: function (d, i) {
      //corrige la valeur suite modif dans la fonction lineParser : valuetoaffect
      var correctedval = d.value / 10;
      return `${d.block_id}:${Math.round(d.position)} > ${correctedval}`
    }
  }
  return line
}

function highlightConfig(position,orientation,trackname){
  var direction;
 if(orientation == "out"){
  direction = "in"
    var radius = outerStart + (position * 0.22) //écart
    var innerRad = radius + outerTrackWidth //Largeur
  }else{
    direction = "out";
    var radius = innerStart - (position * 0.12);
    var innerRad = radius - innerTrackWidth
  }
  var highlight = {
    innerRadius: innerRad,
    outerRadius: radius,
    opacity: 0.9,
    color: 'red',
    tooltipContent: function (d) {
      return d.name
    }
  }
  return highlight;
}


//Confioguration du scatter
/*function scatterConfig(position,orientation){
  if(orientation == "out"){
    var radius = outerStart + (position * 0.22)
    var innerRad = radius + outerTrackWidth
  }else{
    var radius = innerStart - (position * 0.12);
    var innerRad = radius - innerTrackWidth
  }
  var scatter = {
    innerRadius: innerRad,
    outerRadius: radius,
    color: 'grey',
    strokeColor: 'grey',
    strokeWidth: 0,
    shape: 'circle',
    direction : 'in',
    size: 10,
    axes: [
    {
      spacing: 100000000000000000000000000000000000,
      thickness: 1,
      color: '#000000',
      opacity: 0.7
    }],
    tooltipContent: function (d, i) {
      return `${d.block_id}:${Math.round(d.position)} > ${d.value}`
    }
  }
  return scatter;
  // 
}*/
function scatterConfig(position,orientation,trackname){
  if(orientation == "out"){
    var radius = outerStart + (position * 0.22)
    var innerRad = radius + outerTrackWidth
  }else{
    var radius = innerStart - (position * 0.12);
    var innerRad = radius - innerTrackWidth
  }
  var scatter = {
    innerRadius: innerRad,
    outerRadius: radius,
    strokeColor: 'grey',
    strokeWidth: 1,
    shape: 'circle',
    direction : 'in',
    size: 14,
    axes: [
    {
      spacing: 100000000000000000000000000000000000,
      thickness: 1,
      color: '#000000',
      opacity: 0.7
    }],
    tooltipContent: function (d, i) {
      return trackname + ':<br/>'+`${d.block_id}:${Math.round(d.position)} > ${d.value}`
    }
  }
  return scatter;
  //
}

//Configuration du type histogram
function histogramConfig(position,orientation){
  //console.log("histogram config orientation : "+orientation+" max"+max);
  var radius;
  var innerRad
 if(orientation == "out"){
    innerRad = outerStart + (position * 0.22)
    radius = innerRad + outerTrackWidth
    //console.log("radius :"+radius+" innerRad"+innerRad);
  }else{
    radius = radius - (position * 0.12);
    innerRad = innerStart - innerTrackWidth
  }
  var histogram = {
    innerRadius: innerRad,
    outerRadius: radius,
    color: 'RdPu',
    opacity: 1,
    min: 0,
    max: 500,
    axes: [
    {
      color: 'grey',
      thickness: 1, // in pixel
      opacity: 1, // between 0 and 1
      position : 0.1
    }
  ],
    tooltipContent: function (d, i) {
      return `${d.block_id}:${d.start} > ${d.value}`
    }
  }
  return histogram;
}


function stackConfig(position, orientation,trackname){
  var direction;
  var radius;
  if(orientation == "out"){
    direction = "in"
    var radius = outerStart + (position * 0.22) //écart
    var innerRad = radius + outerTrackWidth //Largeur
  }else{
    direction = "out";
    var radius = innerStart - (position * 0.03);
    var innerRad = radius - innerTrackWidth
  }
  var stack = {
    //innerRadius: 0.7,//innerRad,
    innerRadius: innerRad,
    //outerRadius: 1,//radius,
    outerRadius: radius,
    color: function (d) {
      if (d.color == "red") {
        return '#df2112'
      } else if (d.color == "blue") {
        return '#1a40e2'
      } else if (d.color == "green") {
        return '#25e924'
      } else if (d.color == "grey") {
        return '#a3a7a9'
      } else if (d.color == "black") {
        return '#000000'
      }
      else {
        return d.color;
      }
    },
    strokeWidth: 0,
    direction: 'out',
    thickness: 3,
    radialMargin: 0.1,

    //radialMargin: 2,
    margin: 0.1,
    tooltipContent: function (d) {
        return d.indiv
      },
    opacity: 1
  }
  return stack
}

// ----------------------------- FIN PARTIE GENERATION DE CONFIG ------------------------------ //












// ----------------------------- PARTIE MAPPIND DE VARIABLES ------------------------------ //

/*Le mappeur est optionnel pour certaines track, mais il est toujours mieux de le mettre au cas ou on tombre un jour sur un cas ou ça ne fonctionnerait plus*/


//Var mapping pour le type chord
function chordVarMapper(fileName){
  mappedVar = fileName.map(function (d) {
    return {
      source: {
        id: d.source,
        start: parseInt(d.source_start) - 200000,
        end: parseInt(d.source_end) + 200000},
        target: {
          id: d.target,
          start: parseInt(d.target_start) - 200000,
          end: parseInt(d.target_end) + 200000
        }
      }
    }
    );
  return mappedVar;
}

//Mappeur pour le type heatmap
function heatmapVarMapper(fileName){
  var mappedVar =fileName.map(function(d) {
    return {
      block_id: d.chromosome,
      start: parseInt(d.start),
      end: parseInt(d.end),
      value: parseFloat(d.value)
    };
  });
  return mappedVar;
}

//Mappeur pour le type Line
function lineVarMapper(fileName){
  var mappedVar = fileName.map(function (d) {
    return {
      block_id: d.chromosome,
      position: parseInt(d.start),
      value: d.value
    }
  });
  return mappedVar;
}

//Mappeur pour le type Cytobands
function cytobandsVarMapper(fileName){
  cytobands = fileName
  .map(function (d) {
    return {
      block_id: d.chromosome,
      start: parseInt(d.start),
      end: parseInt(d.end),
      gieStain: d.gieStain,
      name: d.name
    }
  })
  return cytobands;
}

//Mappeur pour le type scatter
function scatterVarMapper(fileName){
  var mappedVar = fileName.map(function (d) {
    return {
      block_id: d.chromosome,
      position: parseInt(d.start),
      value: d.value
    }
  });
  return mappedVar;
}

//Mappeur pour le type stack
function stackVarMapper(fileName){
  var mappedVar = fileName.map(function (d) {
    d.block_id = d.chr
    d.start = d.start
    d.end = d.end
    d.indiv = d.indiv
    return d;
  });
  return mappedVar;
}

//Mapper histogram
function histogramVarMapper(fileName){
mappedVar = fileName
  .map(function (d) {
    //console.log("blockid : "+d.block_id+" start : "+d.start+" end : "+d.end+" value : "+d.value+"\n");
    return {
      block_id: d.block_id,
      start: parseInt(d.start),
      end: parseInt(d.end),
      value: parseInt(d.value)
    }
  })

  return mappedVar;
}


// ----------------------------- FIN PARTIE MAPPIND DE VARIABLES ------------------------------ //





// ----------------------------- PARTIE GENERATION DE CIRCOS ------------------------------ //

//Fonction qui génère un id aléatoire pour les track circos
function randomId(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for( var i=0; i < 7; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//Fonction qui génère une couleur aléatoire au format HEX
function randomColor(){
  var color = "#";
  var possible = "0123456789ABCDEF";
  for( var i=0; i < 6; i++ )
    color += possible.charAt(Math.floor(Math.random() * possible.length));
  return color;
}

//Fonction qui pick un nom aleatoire pour la page //A remove
function randomName(){
  var name = "";
  var possible = ["Aai","Adzuki","Adzumi","Adzusa","Ae","Aeri","Ageha","Ai","Aiha","Aiho","Aika","Aiki","Aiko","Aimi","Aina","Aine","Aino","Aira","Airi","Airu","Aisa","Aise","Aisha","Aito","Aiya","Aiyu","Aka","Akae","Akaho","Akaki","Akana","Akane","Akari","Akatsuki","Akeha","Akeki","Akemi","Akeno","Akeo","Akeyo","Aki","Akie","Akiha","Akiho","Akii","Akika","Akiko","Akime","Akimi","Akina","Akine","Akino","Akira","Akisa","Akiyo","Ako","Akuro","Amarante","Amaya","Ameri","Ami","Amika","Amu","Anan","Anbi","Anda","Aneko","Anji","Anju","Anka","Anmi","Anna","Anne","Anon","Anri","Anru","Ansha","Anzu","Ao","Aoba","Aoha","Aoi","Aoka","Aoki","Aomi","Aona","Aono","Aori","Aose","Aoto","Aozora","Arei","Ari","Arie","Ariha","Ariho","Arika","Arimi","Arin","Arina","Arisa","Arise","Arisu","Arufa","Aruha","Aruna","Asa","Asae","Asagi","Asahi","Asaho","Asai","Asaka","Asaki","Asako","Asami","Asana","Asao","Asara","Asari","Asayo","Asuhi","Asuka","Asumi","Atsue","Atsuka","Atsuki","Atsuko","Atsumi","Atsuna","Atsune","Atsuno","Atsusa","Atsuyo","Awana","Awano","Aya","Ayae","Ayaha","Ayahi","Ayaho","Ayai","Ayaka","Ayaki","Ayako","Ayame","Ayami","Ayamu","Ayana","Ayane","Ayano","Ayao","Ayara","Ayari","Ayasa","Ayase","Ayato","Ayayo","Ayu","Ayuka","Ayuki","Ayume","Ayumi","Ayumu","Ayuna","Ayuno","Ayuri","Ayusa","Ayuto","Azuki","Azumi","Azuna","Azusa","Benten","Biei","Chia","Chiaki","Chiaya","Chidzuki","Chidzuko","Chidzumi","Chidzuru","Chie","Chieko","Chiemi","Chieri","Chigusa","Chiharu","Chihaya","Chihiro","Chiho","Chika","Chikae","Chikage","Chikako","Chikano","Chikara","Chikaru","Chikasa","Chikashi","Chiki","Chiko","Chikoto","Chikuma","China","Chinae","Chinami","Chinari","Chinaru","Chinatsu","Chino","Chinon","Chio","Chiori","Chisa","Chisaki","Chisako","Chisane","Chisato","Chise","Chisei","Chisumi","Chitose","Chiya","Chiyeko","Chiyo","Chiyoko","Chiyomi","Chiyu","Chiyuki","Chiyumi","Chizuru","Cho","Chou","Chura","Dai","Echiko","Ehana","Eho","Ei","Eiha","Eiichi","Eika","Eiko","Eimi","Eina","Eiri","Eko","Ema","Emi","Emiho","Emika","Emiko","Emina","Emio","Emiri","Emu","En","Ena","Eo","Epo","Eran","Ere","Erei","Eren","Erena","Eri","Erika","Eriko","Erin","Erina","Eriya","Eru","Eruna","Eruru","Etsuho","Etsuki","Etsuko","Etsumi","Etsuyo","Euiko","Fua","Fubuki","Fujika","Fujiko","Fujina","Fujino","Fujisa","Fuki","Fumi","Fumie","Fumika","Fumiki","Fumiko","Fumina","Fumino","Fumiyo","Fusa","Fusae","Fusako","Fusana","Fusano","Futaba","Fuu","Fuua","Fuuga","Fuuha","Fuui","Fuuka","Fuuki","Fuuna","Fuune","Fuuno","Fuusa","Fuyu","Fuyue","Fuyuhi","Fuyuka","Fuyuko","Fuyume","Fuyumi","Fuyune","Fuyuno","Fyei","Gemmei","Gen","Gin","Ginko","Gou","Hadzuki","Haine","Haju","Hako","Hama","Hami","Hana","Hanae","Hanaha","Hanaka","Hanako","Hanami","Hanano","Hanari","Hanatsu","Haniko","Hanna","Hano","Hanon","Hanri","Hare","Haru","Harue","Haruha","Haruhi","Haruho","Harui","Haruka","Haruki","Harukichi","Haruko","Haruku","Haruma","Harume","Harumi","Harumo","Harumu","Haruna","Harune","Haruno","Haruo","Haruse","Haruyo","Hase","Hasumi","Hatsue","Hatsuho","Hatsuka","Hatsuki","Hatsuku","Hatsumi","Hatsuna","Hatsune","Hatsuno","Hatsuyo","Haya","Hayaka","Hayami","Hayane","Hayasa","Hayase","Hazumi","Hazuna","Hibiki","Hide","Hideko","Hidemi","Hideri","Hidzuki","Hiho","Hiina","Hiira","Hiiragi","Hiiro","Hiizu","Hikana","Hikari","Hikaru","Himari","Himawari","Hina","Hinagi","Hinaki","Hinako","Hinami","Hinano","Hinari","Hinata","Hinatsu","Hinayo","Hinon","Hiori","Hirari","Hiroa","Hiroe","Hiroha","Hiroka","Hiroko","Hiromi","Hiromu","Hirona","Hirone","Hirono","Hiroo","Hiroshi","Hiroyo","Hisa","Hisae","Hisaho","Hisaka","Hisaki","Hisako","Hisami","Hisana","Hisano","Hisashi","Hisato","Hisayo","Hisui","Hitoe","Hitoha","Hitoka","Hitomi","Hitomo","Hitona","Hitone","Hitono","Hitose","Hitoshi","Hitsuji","Hiyo","Hiyori","Hiyu","Hiyumi","Hodaka","Hodzumi","Hoharu","Hoki","Hona","Honami","Honatsu","Honoka","Honomi","Honon","Honone","Honori","Hoshi","Hoshie","Hoshiha","Hoshiko","Hoshimi","Hoshina","Hoshine","Hoshino","Hoshiyo","Hotaru","Hotona","Hotsumi","Houka","Hozue","Hozumi","Hozumu","Hyuu","Ibuki","Ichi","Ichie","Ichiha","Ichika","Ichimi","Ichina","Ichine","Ichino","Idzumi","Ika","Iku","Ikue","Ikuho","Ikuka","Ikuko","Ikumi","Ikuna","Ikuno","Ikuyo","Imari","Imi","Ina","Inami","Inari","Inatsu","Inori","Inoru","Inoue","Io","Ion","Iori","Ira","Irei","Iri","Irii","Iroha","Iru","Iruka","Isa","Isae","Isaki","Isako","Ise","Isuzu","Ito","Itono","Itsue","Itsuho","Itsuka","Itsuki","Itsuko","Itsumi","Itsuna","Iyo","Iyori","Izuho","Izumi","Jin","Jio","Joruri","Juai","Juan","Juchika","Jue","Juho","Juka","Juki","Jukia","Jun","Juna","June","Junka","Junko","Junmi","Junna","Juno","Junrei","Junri","Jura","Juri","Jurin","Juru","Kaai","Kadzuho","Kadzuki","Kadzumi","Kadzusa","Kae","Kaede","Kagami","Kahana","Kahane","Kaho","Kahori","Kai","Kaida","Kairi","Kaiya","Kaiyo","Kajitsu","Kaju","Kaki","Kako","Kameko","Kami","Kammi","Kammie","Kana","Kanade","Kanae","Kanaha","Kanaho","Kanako","Kaname","Kanami","Kanan","Kanana","Kanari","Kanatsu","Kanawa","Kanayo","Kane","Kaneko","Kanna","Kano","Kanoha","Kanoho","Kanoka","Kanon","Kanori","Kao","Kaon","Kaori","Kaoru","Karan","Karei","Karen","Kari","Karibu","Karin","Karina","Kasaki","Kasane","Kashi","Kasuga","Kasui","Kasumi","Kasune","Kata","Katsue","Katsuki","Katsuko","Katsumi","Kaya","Kayasa","Kayo","Kayoko","Kayou","Kayu","Kayume","Kazu","Kazuchi","Kazue","Kazuha","Kazuhi","Kazuho","Kazuka","Kazuko","Kazumi","Kazuna","Kazune","Kazuno","Kazura","Kazuri","Kazusa","Kazuwo","Kazuyo","Kei","Keiga","Keika","Keiki","Keiko","Keimi","Keina","Keino","Keiri","Keiru","Keisa","Keito","Kia","Kichi","Kichino","Kie","Kifumi","Kiharu","Kihiro","Kiho","Kii","Kiiko","Kiiro","Kika","Kiki","Kiko","Kiku","Kikue","Kikuko","Kikuno","Kikyou","Kimi","Kimie","Kimihi","Kimii","Kimika","Kimiko","Kimina","Kimino","Kimiyo","Kimiyu","Kimu","Kin","Kina","Kinami","Kinatsu","Kino","Kinoka","Kinori","Kinue","Kinuka","Kinuko","Kinumi","Kinuye","Kinuyo","Kioko","Kira","Kiran","Kirara","Kirari","Kiri","Kirika","Kiriko","Kirin","Kirina","Kirine","Kisa","Kisaki","Kisaya","Kisei","Kisha","Kishi","Kishuu","Kita","Kitsuki","Kiwa","Kiya","Kiyo","Kiyoe","Kiyoha","Kiyohi","Kiyoho","Kiyoi","Kiyoka","Kiyoko","Kiyomi","Kiyona","Kiyono","Kiyora","Kiyoshi","Kiyu","Kiyui","Kiyuki","Kiyuu","Kobato","Kochiyo","Kohaku","Kohana","Kohane","Koharu","Kohina","Koi","Koimi","Koiso","Koken","Koko","Kokoa","Kokoe","Kokoha","Kokomi","Kokona","Kokone","Kokori","Kokoro","Kokoru","Komachi","Komaki","Komiki","Komina","Komoe","Komomo","Komugi","Kona","Konami","Konan","Konana","Konatsu","Konoe","Konoha","Konoka","Konoma","Konomi","Korin","Kosato","Kosui","Kosumi","Kosumo","Kosuzu","Koto","Kotoa","Kotoe","Kotoha","Kotoho","Kotoka","Kotoki","Kotoko","Kotome","Kotomi","Kotona","Kotone","Kotono","Kotora","Kotori","Kotose","Kotowa","Kotoyo","Kou","Koue","Kouhi","Kouki","Koumi","Kouna","Koura","Kouran","Kouri","Kousei","Kouyou","Koyori","Koyuki","Koyume","Koyumi","Koyuri","Kozato","Kozue","Kozumi","Kumi","Kumiko","Kuni","Kunie","Kuniko","Kuniyo","Kuno","Kura","Kuran","Kurea","Kureha","Kurei","Kurena","Kureno","Kuri","Kuria","Kuruchi","Kurue","Kurumi","Kyara","Kyoko","Kyou","Kyouka","Kyouki","Kyouko","Kyoumi","Kyouna","Kyoune","Kyouno","Maai","Maasa","Maaya","Mabuki","Machi","Machiko","Madoha","Madoka","Mae","Maeko","Maemi","Mafumi","Mafuyu","Maha","Mahime","Mahiro","Mahiru","Maho","Mahona","Mai","Maia","Maiha","Maiho","Maika","Maiki","Maiko","Maina","Maine","Maino","Maira","Mairi","Maiya","Maka","Makana","Maki","Makie","Makiha","Makiho","Makika","Makiko","Makina","Makino","Makinu","Mako","Makoto","Mami","Mamiko","Mamori","Mana","Manae","Manaha","Manaka","Manako","Manama","Manami","Manan","Manano","Manao","Manare","Manari","Manase","Manato","Manatsu","Manaya","Mane","Mano","Manon","Mao","Maon","Maou","Mara","Mare","Marei","Mareka","Maremu","Maren","Marena","Mari","Maria","Marie","Marika","Mariko","Marin","Marina","Mario","Marisa","Marise","Mariya","Maru","Masae","Masai","Masaki","Masako","Masami","Masana","Masano","Masayo","Mashiho","Masumi","Matsu","Matsuki","Matsuko","Matsumi","Matsuri","Matsuyo","Mau","Maya","Mayaka","Mayako","Mayo","Mayoko","Mayu","Mayue","Mayui","Mayuka","Mayuki","Mayuko","Mayume","Mayumi","Mayumu","Mayuna","Mayura","Mayuri","Mayuu","Mayuzumi","Mebae","Mebuki","Megu","Meguho","Meguka","Megumi","Meguri","Mei","Meika","Meiko","Meina","Meira","Meiran","Meiri","Meiya","Memi","Memori","Mena","Meo","Meya","Meyu","Mia","Miaka","Miaki","Miako","Miasa","Miaya","Mibuki","Michi","Michie","Michiho","Michika","Michiko","Michina","Michio","Michiru","Michiyo","Midori","Midzue","Midzuho","Midzuka","Midzuki","Mie","Miei","Mieko","Mifuki","Mifuu","Mifuyu","Miha","Mihae","Mihana","Mihane","Miharu","Mihato","Mihaya","Mihayu","Mihime","Mihiro","Miho","Mihoka","Mihoko","Mihona","Mii","Miiha","Miiko","Miina","Miine","Miiru","Miju","Mika","Mikae","Mikako","Mikan","Mikana","Mikari","Mikawa","Mikayo","Miki","Mikie","Mikiho","Mikiko","Mikina","Mikino","Mikiyo","Miko","Mikoto","Miku","Mikuho","Mikuka","Miliko","Mima","Mimari","Mimi","Mimori","Mimu","Mina","Minae","Minagi","Minaha","Minaho","Minai","Minaka","Minaki","Minako","Minami","Minamo","Minao","Minari","Minase","Minato","Minatsu","Mine","Mineka","Mineki","Mineko","Mineri","Mino","Minoka","Minoki","Minon","Minori","Minoru","Mio","Mioha","Mioka","Miomi","Mion","Miora","Miori","Mioto","Miou","Mirai","Miran","Mire","Mirei","Miri","Miru","Miruka","Misa","Misaho","Misaki","Misako","Misao","Misato","Misawo","Mishuri","Misono","Misora","Misumi","Misuzu","Mito","Mitsu","Mitsue","Mitsugi","Mitsuha","Mitsuho","Mitsuka","Mitsuki","Mitsuko","Mitsumi","Mitsuna","Mitsune","Mitsuno","Mitsuyo","Miu","Miwa","Miwako","Miwo","Miya","Miyabi","Miyako","Miyano","Miyo","Miyoka","Miyoko","Miyoshi","Miyou","Miyu","Miyuho","Miyuka","Miyuki","Miyumi","Miyusa","Miyuu","Mizue","Mizuha","Mizuho","Mizuka","Mizuki","Mizumi","Mizuna","Mizune","Mizuno","Mizuo","Mizuse","Moa","Moe","Moeka","Moeko","Moemi","Moeno","Moeri","Moi","Moka","Moko","Momi","Momie","Momika","Momo","Momoa","Momoe","Momoha","Momohi","Momoka","Momoki","Momoko","Momoku","Momomi","Momona","Momone","Momono","Momoo","Momose","Momoyo","Mona","Monaka","Monami","Monan","Mone","Mono","Moori","More","Moto","Motoe","Motoi","Motoka","Motoko","Motomi","Mowa","Moyu","Moyumi","Mume","Mura","Muteki","Mutsue","Mutsuka","Mutsuki","Mutsuko","Mutsumi","Mutsuyo","Nachi","Nachie","Nachika","Nadzuki","Nae","Naemi","Naeri","Nagino","Nagisa","Naho","Nahoko","Naina","Naka","Nami","Namie","Namiha","Namiho","Namika","Namiki","Namiko","Namina","Namisa","Namiyo","Nana","Nanae","Nanaha","Nanaho","Nanaka","Nanaki","Nanako","Nanami","Nanan","Nanana","Nanane","Nanao","Nanari","Nanasa","Nanase","Nanashi","Nanato","Nanatsu","Nanaya","Nanka","Nanoha","Nanoka","Nanoko","Nanon","Nanri","Nao","Naoe","Naoha","Naoka","Naoki","Naoko","Naomi","Naon","Naora","Naori","Naren","Nari","Narika","Nariko","Narisa","Naru","Narue","Naruho","Naruka","Narumi","Nasa","Natsu","Natsue","Natsuha","Natsuho","Natsui","Natsuka","Natsuki","Natsuko","Natsume","Natsumi","Natsuna","Natsune","Natsusa","Natsuyo","Nattsu","Nau","Nawa","Naya","Nayo","Nayoko","Nayu","Nayuki","Nayume","Nayumi","Nayura","Nazumi","Nazuna","Neiro","Nemu","Nene","Nera","Neu","Nichika","Nie","Niima","Niina","Niino","Niji","Nijiha","Nijiho","Nijika","Nijina","Niki","Niko","Nina","Nire","Nirei","Nishi","Noa","Nobu","Nobue","Nobuko","Nodoka","Noeru","Noma","Nomi","Nona","Nonka","Nonno","Nono","Nonoka","Nori","Noria","Norie","Noriha","Norika","Noriko","Norina","Norino","Norisa","Norito","Noriyo","Nozomi","Nyoko","Ochiyo","Oharu","Oki","Okichi","Okiku","Omitsu","Omoi","Omoka","Ooaya","Orie","Orika","Orina","Orino","Orisa","Oto","Otoe","Otoha","Otoka","Otona","Otose","Otowa","Otsu","Otsune","Ouka","Oumi","Ouna","Ouri","Pinku","Raichi","Raicho","Raika","Raiki","Raimi","Raina","Raira","Rairi","Raisa","Raito","Raku","Rama","Rami","Ramu","Ran","Rana","Ranan","Ranna","Rara","Rasa","Rea","Reeko","Reemi","Reen","Reena","Reho","Rei","Reia","Reiha","Reiho","Reika","Reiki","Reiko","Reimi","Reina","Reini","Reino","Reira","Reiri","Reisa","Reishi","Reiya","Rema","Remi","Remon","Ren","Rena","Reno","Renon","Reo","Reon","Rera","Reri","Ria","Rian","Ridzu","Ridzuki","Rie","Rieko","Riemi","Riha","Riharu","Riho","Rii","Riju","Rika","Rikako","Rikana","Rikei","Riki","Rikka","Riko","Riku","Rikuka","Rima","Rimi","Rin","Rina","Rinako","Rine","Ringo","Rini","Rinka","Rinna","Rinne","Rino","Rinon","Rio","Rion","Riona","Riori","Rira","Riran","Rirei","Riri","Riria","Ririka","Ririna","Riru","Risa","Risaki","Risako","Risana","Risato","Rise","Risuzu","Rito","Ritsu","Ritsue","Ritsuho","Ritsuki","Ritsuko","Ritsuna","Ritsuno","Riu","Riya","Riyo","Riyu","Riyuu","Riza","Rizu","Rizumu","Romi","Rua","Rubi","Rui","Ruina","Ruiri","Ruka","Ruki","Rumi","Rumiko","Rumoi","Runa","Runmi","Runo","Ruo","Rura","Ruri","Rurika","Ruriko","Ruru","Ruuna","Ruuru","Ryoko","Ryou","Ryoubi","Ryouga","Ryouha","Ryouka","Ryouko","Ryoumi","Ryouna","Ryuubi","Ryuuka","Ryuumi","Ryuuri","Saa","Saaki","Saara","Saari","Saaya","Sachi","Sachie","Sachiho","Sachika","Sachiko","Sachimi","Sachina","Sachino","Sachio","Sachiwo","Sachiyo","Sada","Sadako","Sae","Saeka","Saeko","Saemi","Saera","Saeri","Saharu","Sahi","Saho","Sahoko","Sahori","Sai","Saiha","Saiju","Saika","Saimi","Saira","Sairi","Saisha","Saito","Saka","Sakae","Sakaki","Sakamae","Saki","Sakie","Sakiha","Sakiho","Sakika","Sakiko","Sakimi","Sakimo","Sakina","Sakino","Sakira","Sakisa","Sakiyo","Saku","Sakue","Sakuko","Sakumi","Sakuna","Sakuno","Sakura","Sakurako","Sakuri","Sakuro","Sama","Samasa","Sami","San","Sana","Sanae","Sanako","Sanami","Sanatsu","Sane","Sango","Sano","Sao","Saori","Sara","Sarana","Sarasa","Sari","Sarii","Sarina","Sasa","Sasara","Sasha","Sata","Sato","Satoe","Satoha","Satoho","Satoka","Satoko","Satoma","Satomi","Satona","Satone","Satono","Satori","Satsuka","Satsuki","Satu","Sau","Sawa","Sawae","Sawaka","Sawaki","Sawako","Sawami","Sawayo","Saya","Sayaka","Sayaki","Sayako","Sayami","Sayano","Sayo","Sayoko","Sayomi","Sayori","Sayu","Sayui","Sayuka","Sayuki","Sayumi","Sayuri","Sea","Sei","Seiga","Seiha","Seiho","Seiju","Seika","Seikai","Seiki","Seiko","Seima","Seina","Seine","Seino","Seira","Seiri","Seisa","Seiya","Seka","Seki","Sen","Sena","Senna","Senri","Seo","Sera","Serena","Seri","Seria","Serie","Serika","Serina","Serisa","Seshiru","Setsuka","Setsuko","Seu","Seya","Shidzu","Shidzue","Shidzuka","Shidzuki","Shidzuku","Shidzuru","Shie","Shiemi","Shien","Shieri","Shieru","Shige","Shigeno","Shiho","Shii","Shiimi","Shiina","Shiine","Shiino","Shika","Shiki","Shima","Shimizu","Shina","Shinju","Shinko","Shino","Shinobu","Shinon","Shio","Shioe","Shioi","Shioka","Shiokaze","Shioko","Shiomi","Shion","Shiona","Shiono","Shiora","Shiori","Shiose","Shiou","Shiraho","Shisa","Shisei","Shisumi","Shiun","Shiyono","Shiyori","Shiyou","Shiyu","Shizu","Shizue","Shizuha","Shizuho","Shizuka","Shizuki","Shizuko","Shizuku","Shizuma","Shizumi","Shizuna","Shizuno","Shizuo","Shizura","Shizuri","Shizuru","Shizusa","Shizuse","Shizuto","Shizuyo","Shoka","Shoken","Shoko","Shoon","Shouka","Shouko","Shouna","Shue","Shuho","Shuka","Shuki","Shuma","Shun","Shuna","Shunri","Shunyou","Shura","Shuri","Shusa","Shuu","Shuuha","Shuuho","Shuuka","Shuuki","Shuuko","Shuumi","Shuuna","Soeru","Sona","Sono","Sonoe","Sonoka","Sonoko","Sonomi","Sora","Souka","Soyo","Soyoka","Soyono","Suguri","Sui","Suika","Suki","Suko","Suma","Sumi","Sumie","Sumiha","Sumiho","Sumika","Sumiko","Sumina","Sumino","Sumio","Sumire","Sumiyo","Sumomo","Sunaho","Suzu","Suzue","Suzuha","Suzuho","Suzuka","Suzuki","Suzuko","Suzuma","Suzume","Suzumi","Suzuna","Suzune","Suzuno","Suzuto","Suzuyo","Tadako","Tae","Taeko","Taena","Tai","Taji","Taka","Takae","Takaha","Takako","Takami","Takana","Takane","Takara","Takase","Takayo","Tama","Tamae","Tamafune","Tamaha","Tamahi","Tamaho","Tamai","Tamaka","Tamaki","Tamami","Tamamo","Tamao","Tamara","Tamari","Tamawo","Tamayo","Tami","Tamie","Tamika","Tamiko","Tamiyo","Tanak","Taniko","Tansho","Tao","Tara","Taree","Tatsumi","Taura","Taya","Tenna","Tenri","Tenru","Terue","Teruha","Terumi","Teruna","Teruno","Teruyo","Toa","Tochika","Toka","Toki","Tokie","Tokiha","Tokiko","Tokino","Tokiri","Tokiyo","Toko","Toku","Tokuko","Tomi","Tomie","Tomiko","Tomo","Tomoa","Tomoe","Tomoha","Tomoka","Tomoki","Tomoko","Tomomi","Tomona","Tomone","Tomono","Tomoo","Tomose","Tomoyo","Tona","Tonami","Tono","Toomi","Toon","Tooru","Toshi","Toshie","Toshika","Toshiko","Toshimi","Toshino","Toshiyo","Touka","Toumi","Touna","Towa","Toya","Toyoko","Tsubame","Tsubasa","Tsue","Tsugumi","Tsuguri","Tsukasa","Tsuki","Tsukiyama","Tsukumi","Tsuneko","Tsutae","Tsutako","Tsuya","Ubuka","Ui","Uika","Ume","Umeka","Umeko","Umi","Umie","Umina","Una","Uno","Urako","Uran","Urara","Urei","Uru","Urue","Uruha","Urume","Urumi","Ururu","Usa","Usagi","Ushio","Uta","Utae","Utaha","Utaka","Utako","Utami","Utano","Utayo","Utsuki","Uyo","Waka","Wakaba","Wakae","Wakaha","Wakaho","Wakako","Wakami","Wakana","Wakano","Wakao","Wattan","Waya","Wayu","Wazuka","Yachi","Yae","Yaeko","Yaemi","Yama","Yasu","Yasue","Yasuha","Yasuho","Yasuka","Yasuki","Yasuko","Yasumi","Yasuna","Yasuno","Yasuo","Yasura","Yasuyo","Yayoi","Yayori","Yazuya","Yodo","Yoko","Yomishi","Yomogi","Yori","Yorie","Yorika","Yoriko","Yorimi","Yorina","Yoshe","Yoshi","Yoshie","Yoshiho","Yoshika","Yoshike","Yoshiki","Yoshiko","Yoshimi","Yoshina","Yoshine","Yoshino","Yoshiri","You","Youju","Youka","Youko","Youna","Yousei","Yu","Yua","Yuami","Yuan","Yuara","Yuari","Yuasa","Yuchika","Yudzuha","Yudzuki","Yudzuru","Yue","Yuei","Yufu","Yuhana","Yuhaya","Yuhiro","Yuho","Yui","Yuiga","Yuiha","Yuiho","Yuika","Yuiki","Yuiko","Yuina","Yuine","Yuiri","Yuisa","Yuka","Yukako","Yukana","Yukari","Yukayo","Yuki","Yukia","Yukie","Yukiha","Yukiho","Yukika","Yukiko","Yukimi","Yukina","Yukine","Yukino","Yukio","Yukisa","Yukise","Yukiyo","Yuko","Yuma","Yumako","Yume","Yumeha","Yumeho","Yumeka","Yumemi","Yumena","Yumeri","Yumeto","Yumi","Yumie","Yumika","Yumiko","Yumina","Yumine","Yumino","Yumio","Yumiyo","Yuna","Yune","Yuni","Yuno","Yunoka","Yunon","Yuo","Yuori","Yura","Yuri","Yuriha","Yurika","Yuriko","Yurima","Yusa","Yusana","Yusato","Yusuke","Yuto","Yutsuki","Yutsuru","Yuu","Yuua","Yuuga","Yuuha","Yuuhi","Yuuho","Yuui","Yuuka","Yuuki","Yuuko","Yuumi","Yuuna","Yuuno","Yuuri","Yuusa","Yuuwa","Yuuyu","Yuya","Yuyu","Yuzu","Yuzuha","Yuzuho","Yuzuka","Yuzuki","Yuzumi","Yuzuru","Yuzusa"];
  name += possible[(Math.floor(Math.random() * possible.length))];
  return name;
}

//Fonction qui ajoute tout le code html lors qu'une track est ajoutée
function addNewTrack(){
  
  ///Permet de limiter le nombre de track dans le circos
  if(id>30){ 
    alert("Too many items ;)")
    return null;
  }

  ///////////////////////////////////////////
  //menu track
  /////////////////////////////////////////

  //////liste des tracks
  var trackdiv = document.getElementById("tracks_content");

  var formdiv = document.createElement('div');
  formdiv.setAttribute("class","form-horizontal");
  var fieldset = document.createElement("fieldset");

  var legend = document.createElement("legend");
  legend.setAttribute("id","legend"+getN());
  fieldset.appendChild(legend);

  //////Fenetre track
  var formgroup = document.createElement('div');
  formgroup.setAttribute("class","form-group");

  //////champs NAME
  var label = document.createElement('label');
  label.setAttribute("for","name"+getN())
  label.setAttribute("class","col-lg-4 control-label");
  label.appendChild(document.createTextNode("Name"));
  var divcontent = document.createElement("div");
  divcontent.setAttribute("class","col-lg-7");
  var input = document.createElement("input");
  input.setAttribute("type","text")
  input.setAttribute("onchange","document.getElementById(\"legend"+getN()+"\").innerHTML = this.value")
  input.setAttribute("class","form-control")
  input.setAttribute("id","name"+getN())
  input.setAttribute("placeholder","Track Name");

  divcontent.appendChild(input);
  formgroup.appendChild(label);
  formgroup.appendChild(divcontent);
  fieldset.appendChild(formgroup);

  //champs TYPE
  formgroup = document.createElement('div');
  formgroup.setAttribute("class","form-group");
  label = document.createElement('label');
  label.setAttribute("for","select")
  label.setAttribute("class","col-lg-4 control-label");
  label.appendChild(document.createTextNode("Type"));
  divcontent = document.createElement("div");
  divcontent.setAttribute("class","col-lg-7");

  //bouton select type de track
  input = document.createElement("select");
  //input.setAttribute("multiple", "")
  input.setAttribute("id","selectType"+getN());
  input.setAttribute("class", "form-control");
  input.setAttribute("onchange","updateFields(this.value,\""+getN()+"\");");

  for(var i=0; i<options.length;i++){
    var option = document.createElement('option');
    option.value = options[i];
    option.text= options[i];
    if(i>6){
      var att = document.createAttribute("disabled");
      option.setAttributeNode(att);
    }
    input.appendChild(option)
  }
  divcontent.appendChild(input);
  formgroup.appendChild(label);
  formgroup.appendChild(divcontent);
  fieldset.appendChild(formgroup);

  //champs DATA
  formgroup = document.createElement('div');
  formgroup.setAttribute("class","form-group");
  label = document.createElement('label');
  label.setAttribute("for","textArea")
  label.setAttribute("class","col-lg-4 control-label");
  label.appendChild(document.createTextNode("Data"));
  divcontent = document.createElement("div");
  divcontent.setAttribute("class","col-lg-7");
  input = document.createElement("textarea");
  input.setAttribute("rows", "3");
  input.setAttribute("wrap","off");
  input.setAttribute("class", "form-control");
  input.setAttribute("id", "dataFieldArea"+getN());
  var span = document.createElement("span");
  span.setAttribute("class","help-block");
  span.setAttribute("id","help-block"+getN());
  divcontent.appendChild(input);
  divcontent.appendChild(span);
  formgroup.appendChild(label);
  formgroup.appendChild(divcontent);
  fieldset.appendChild(formgroup);

  formgroup = document.createElement('div');
  formgroup.setAttribute("class","form-group");
  formgroup.setAttribute("id","attributefield"+getN());
  fieldset.appendChild(formgroup);

  //Div bouttons
  formgroup = document.createElement('div');
  formgroup.setAttribute("class","form-group");
  divcontent = document.createElement("div");
  divcontent.setAttribute("class","col-lg-12 col-lg-offset-3");

  //Bouton load file
  input = document.createElement("button");
  input.setAttribute("class", "btn btn-primary ");
  input.setAttribute("onclick", "load_file(this.value)");
  input.setAttribute("id", "newLoadData"+getN());
  input.setAttribute("value",getN());
  input.appendChild(document.createTextNode("Load File"));
  divcontent.appendChild(input);

  //Bouton load circos
  input = document.createElement("button");
  input.setAttribute("class", "btn btn-info ");
  input.setAttribute("onclick","load_circos()");
  input.appendChild(document.createTextNode("Draw Circos"));
  divcontent.appendChild(input);

  //Bouton remove track
  input = document.createElement("button");
  input.setAttribute("class", "remove_field btn btn-danger ");
  //input.setAttribute("onclick",'$("#'+getN()+'").remove(); decreaseN();'); 
  //input.setAttribute("onclick",'$("#'+getN()+'").remove(); decreaseN(); load_circos()');
  input.setAttribute("onclick", 'removeTrack(getN())');
  input.appendChild(document.createTextNode("Remove Track"));
  divcontent.appendChild(input);


  // <button href="#" class="remove_field btn-danger col-lg-6 col-lg-offset-4">Remove</button>
  input = document.createElement("input");
  input.setAttribute("class", "btn btn-warning col-lg-6 col-lg-offset-4");
  input.setAttribute("type", "file");
  input.setAttribute("style", "display:none;");
  input.setAttribute("id", "fileInput"+getN());
  var par = document.createElement("h5");
  par.setAttribute("id","par"+getN());
  par.setAttribute("class"," col-lg-offset-5");

  formgroup.appendChild(divcontent);
  formgroup.appendChild(input);
  formgroup.appendChild(par);
  fieldset.appendChild(formgroup);

  formdiv.appendChild(fieldset);

  //Création d'une track dans le menu track
  var li = document.createElement('li');
  li.setAttribute("class","dropdown-submenu");
  li.setAttribute("id", "track"+getN());

  //créé le click qui va ouvrir le formulaire de la track
  var a = document.createElement('a');
  a.setAttribute("tabindex","-1");
  a.setAttribute("href","#");
  a.appendChild(document.createTextNode("Track "+(getN()+1)));

  //Menu d'1 des tracks
  var ul = document.createElement('ul');
  ul.setAttribute("class","dropdown-menu");
  ul.setAttribute("id", "ul"+getN());

  var li2 = document.createElement('li');





  li2.appendChild(formdiv);
  ul.appendChild(li2)
  li.appendChild(a);
  li.appendChild(ul);


  //Ajoute la track dans le menu track
  trackdiv.appendChild(li);

  updateN();
  //Permet d'afficher le bouton loadcircos lorsqu'une track a été ajoutée
  if(!$("#loadCircos").is(":visible")){
    $("#loadCircos").fadeIn('slow');
  }
  //stop la propagation du clic
  $('#ul'+getN()).click(function(event){
   event.stopPropagation();
 });
}

//fonction qui supprime une track
function removeTrack(trackId){
  trackId--;
  var trackToDelete = document.getElementById("track"+trackId);//.getElementById(trackId);
  console.log(trackId+"\n");  
  console.log("track to delete : "+trackToDelete+"\n");  
  trackToDelete.remove();

}

//Fonction qui permet d'increase le compteur de track lorsque on ajoute des track
function updateN(){

  id++;
}

//Decrease le compteur lorsqu'on delete une track
function decreaseN(){

  id--;
}

//retourne le nombre de track 
function getN(){

  return id;
}

//Fonction qui retourne les chromosomes qui ont été séléctionnées dans le champ select afin de faire un tri plus tard par la fonction triCHR
function getSelectedChromosomes(){
  var selectedValues = [];    
  $("#selectChr :selected").each(function(){
    selectedValues.push($(this).val()); 
  });
  return selectedValues;
}

//Fonction qui permet de charger un fichier pour un input
function load_file(value){
  $("#fileInput"+value).show();
  var fileInput = document.getElementById('fileInput'+value);
  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
     $('#newLoadData'+value).fadeOut('slow');
     $('#fileInput'+value).fadeOut('slow');
     $("#dataFieldArea"+value).text(reader.result);
     $('#par'+value).text("Loaded File : "+file.name);
   };
   reader.readAsText(file);  
 });   
}




//Fonction qui charge tout le circos
function load_circos(){


  document.getElementById("lineChart").innerHTML = "";
  //On crée une nouvelle instance in case of
  circos = new Circos({
    container: '#lineChart', 
    width: width,
    height: width
  })
  //On commence par initialiser le layouut du circos
  circos.layout(chromosomeParser($("#dataFieldAreaC").val()),layoutConfig(6000000,'Mb'));

  var scattercpt=1; //Compte le nombre de scatter dans le circos
  var representationcpt = 0; //Compte le nombre de track globales dans le circos
  var circosOrientation = "in";
  for(var i = 0; i < id; i++){
    var selected = $('#selectType'+i).val();
    if(selected =="Chords"){
      circosOrientation = "out";
    }
  }

  console.log("orientation : " + circosOrientation);

  //La grosse fonction super lourde de la mort qui tue : Boucle qui parcourt toutes les track et qui les ajoute au circos
  for(var i = 0; i < id; i++){

    //progress bar:
    var progWidth = i/(id-1)*100;
    document.getElementById("progBar").style.width = progWidth+"%";
    var trackname = $('#name'+i).val();
    var selected = $('#selectType'+i).val();     //récupère la séléction pour chaque track le type de la track
    var content  = $('#dataFieldArea'+i).val();  //récupère les données
    $('#'+i).click(function(event){               // Empeche la fermeture au clic
     event.stopPropagation();
   });
    //Switch pour les types de track 
    switch(selected){
      case "HeatMap":
      var data = heatmapParser(content)
      if(data.length>1){
        for(var r = 0; r<data.length;r++){
          circos.heatmap(randomId(),heatmapVarMapper(data[r]),heatmapConfig(representationcpt,"RdBu",circosOrientation,data.length,r,trackname));
        }
        representationcpt++;
      }else{
        circos.heatmap(randomId(),heatmapVarMapper(data[0]),heatmapConfig(representationcpt,"RdBu",circosOrientation,1,0,trackname));
        representationcpt++;
      }
      break;
      case "Line":
      var data = lineParser(content);
      if(data.length>1){
        for(var r = 0; r<data.length;r++){
          circos.line(randomId(), lineVarMapper(data[r]),lineConfig(representationcpt,circosOrientation,data.length,trackname));
          circos.scatter(randomId(), lineVarMapper(data[r]),lineScatterConfig(representationcpt,circosOrientation,trackname));
          lineScatterConfig
        }
        representationcpt++;
      }
      else{
        circos.line(randomId(), lineVarMapper(data[0]),lineConfig(representationcpt,circosOrientation,1,trackname));
        circos.scatter(randomId(), lineVarMapper(data[0]),lineScatterConfig(representationcpt,circosOrientation,trackname));
        representationcpt++;
      }
      break;
      case "Chords":
      circos.chords(randomId(),chordVarMapper(chordsParser(content)),chordConfig("1"));
      if(inversions.length>0){
        circos.chords(randomId(),chordVarMapper(inversions),chordConfig("2"));
        inversions = [];
      }
      break;
      case "HighLight":
      circos.highlight(randomId(), cytobandsVarMapper(cytobandsParser(content)),highlightConfig(representationcpt,circosOrientation,trackname))
      break;
      case "Histogram":
      circos.histogram(randomId(), histogramVarMapper(histogramParser(content)) ,histogramConfig(representationcpt,circosOrientation,trackname));
      representationcpt++;
      break;
      case "Scatter":
      if(circosOrientation == "out"){
        circos.scatter(randomId(), scatterVarMapper(scatterParser(content)),scatterConfig(representationcpt,circosOrientation,trackname));
        representationcpt++;
      }
      else{
        circos.scatter(randomId(), scatterVarMapper(scatterParser(content)),scatterConfig(scattercpt,circosOrientation,trackname));
      }
      scattercpt++;
      break;
      case "Stack":
      if(circosOrientation == "out"){
        circosOrientation = "in";
        //console.log("DEBUG STACK if orientation : " + circosOrientation);
        circos.stack(randomId(), stackVarMapper(stackParser(content)),stackConfig(representationcpt,circosOrientation,trackname,trackname));
        representationcpt++;
      }else{
        //console.log("DEBUG STACK else orientation : " + circosOrientation);
        var information = stackParser2(content);
        var nb_indiv = 0;
        for (var k in information) {
             // use hasOwnProperty to filter out keys from the Object.prototype
             if (information.hasOwnProperty(k)) {
		circos.stack(randomId(), stackVarMapper(stackParser(content,k)),stackConfig(representationcpt,circosOrientation,trackname,trackname));
		representationcpt++;
             	nb_indiv++;
    		}
  	}
	
        //circos.stack(randomId(), stackVarMapper(stackParser(content)),stackConfig(representationcpt,circosOrientation,trackname,trackname));
        //representationcpt++;
      }
      break;
      case "Text":
      break;
    } 
  }
  circos.render();
  $("#chrselectli").show();
  if(!$("#resetZoom").is(":visible")){
    $("#resetZoom").fadeIn('slow');


  }

  $(function() {
    panZoomInstance = svgPanZoom('#svgdemo', {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.1
    });

    document.getElementById('resetZoom').addEventListener('click', function(ev){
      ev.preventDefault()
      panZoomInstance.resetZoom()
      panZoomInstance.resize();
      panZoomInstance.fit();
      panZoomInstance.center();
    });

  // zoom out
  panZoomInstance.zoom(1)
})
  
}
function circos_loading(){
  $( function() {
    $( "#cat" ).dialog({
      height: 500,
      width: 725,
      autoOpen: true,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "blind",
        duration: 200
      }
    });
  } );
}

function load_mosaic(){
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#selectType0').val("Stack").change();
  $('#selectType1').val("Stack").change();
  $('#selectType2').val("Stack").change();
  $('#selectType3').val("Stack").change();
  $('#selectType4').val("Stack").change();
  $('#selectType5').val("Stack").change();
  $('#selectType6').val("Stack").change();
  $('#selectType7').val("Stack").change();
  $('#selectType8').val("Stack").change();
  $('#selectType9').val("Stack").change();
  $('#selectType10').val("Stack").change();
  $('#selectType11').val("Stack").change();
  $('#selectType12').val("Stack").change();
  $('#selectType13').val("Stack").change();
  $('#selectType14').val("Stack").change();
  $('#selectType15').val("Stack").change();
  $('#selectType16').val("Stack").change();
  $('#selectType17').val("Stack").change();
  $('#selectType18').val("Stack").change();
  $('#selectType19').val("Stack").change();
  $('#selectType20').val("Stack").change();
  $('#selectType21').val("Stack").change();
  $('#selectType22').val("Stack").change();
  $('#selectType23').val("Stack").change();
  $('#name0').val("acc1").change();
  $('#name1').val("acc2").change();
  $('#name2').val("acc3").change();
  $('#name3').val("acc4").change();
  $('#name4').val("acc5").change();
  $('#name5').val("acc6").change();
  $('#name6').val("acc7").change();
  $('#name7').val("acc8").change();
  $('#name8').val("acc9").change();
  $('#name9').val("acc10").change();
  $('#name10').val("acc11").change();
  $('#name11').val("acc12").change();
  $('#name12').val("acc1").change();
  $('#name13').val("acc2").change();
  $('#name14').val("acc3").change();
  $('#name15').val("acc4").change();
  $('#name16').val("acc5").change();
  $('#name17').val("acc6").change();
  $('#name18').val("acc7").change();
  $('#name19').val("acc8").change();
  $('#name20').val("acc9").change();
  $('#name21').val("acc10").change();
  $('#name22').val("acc11").change();
  $('#name23').val("acc12").change();
  $("#dataFieldAreaC").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/karyotype_banana.txt");
  $("#dataFieldArea0").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Borneo_haplo.tab.test");
  /*$("#dataFieldArea1").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/SF215_haplo.tab");
  $("#dataFieldArea2").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Microcarpa_haplo.tab");
  $("#dataFieldArea3").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Guyod_haplo.tab");
  $("#dataFieldArea4").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PisangMadu_haplo.tab");
  $("#dataFieldArea5").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PisangKlutukWulung_haplo.tab");
  $("#dataFieldArea6").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/GuNinChiao_haplo.tab");
  $("#dataFieldArea7").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Manang_haplo.tab");
  $("#dataFieldArea8").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Monyet_haplo.tab");
  $("#dataFieldArea9").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Galeo_haplo.tab");
  $("#dataFieldArea10").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PTBA00267_haplo.tab");
  $("#dataFieldArea11").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Chicame_haplo.tab");
  $("#dataFieldArea12").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Borneo_haplo.tab");
  $("#dataFieldArea13").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/SF215_haplo.tab");
  $("#dataFieldArea14").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Microcarpa_haplo.tab");
  $("#dataFieldArea15").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Guyod_haplo.tab");
  $("#dataFieldArea16").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PisangMadu_haplo.tab");
  $("#dataFieldArea17").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PisangKlutukWulung_haplo.tab");
  $("#dataFieldArea18").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/GuNinChiao_haplo.tab");
  $("#dataFieldArea19").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Manang_haplo.tab");
  $("#dataFieldArea20").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Monyet_haplo.tab");
  $("#dataFieldArea21").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Galeo_haplo.tab");
  $("#dataFieldArea22").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/PTBA00267_haplo.tab");
  $("#dataFieldArea23").load("http://genomeharvest.southgreen.fr/visu/circosJS/demo/data/Chicame_haplo.tab");
*/
}




function load_test(){
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  $('#newTrackButton').click();
  //$('#newTrackButton').click();

  $('#selectType0').val("Line").change();
  $('#selectType1').val("HeatMap").change();
  $('#selectType2').val("Chords").change();
  $('#selectType3').val("Scatter").change();
  //$('#selectType3').val("Stack").change();

  $('#name0').val("SNP density").change();
  $('#name1').val("Heterozygosity by individual").change();
  $('#name2').val("Similarities").change();
  $('#name3').val("GWAS results").change();
  //$('#name4').val("mosaic").change();

  var pathArray = window.location.pathname.split( '/' );
  var newPathname = "";
  for (i = 0; i < pathArray.length-1; i++) {
        newPathname += "/";
        newPathname += pathArray[i];
  }

  //$('#selectType3').val("Stack").change();
//alert($("#dataFieldAreaC").text);
  $("#dataFieldAreaC").text("chr1 38193400\nchr2 54522928\nchr3 32030951\nchr4 28191985\nchr5 29137935\nchr6 37293965\nchr7 29833120\nchr8 31585744\nchr9 22352177\nchr10 27624748\nchr11 33540656");
  $("#dataFieldArea0").load(window.location.protocol + "//" + window.location.host + newPathname + "/data/SNP.txt");
  $("#dataFieldArea1").load(window.location.protocol + "//" + window.location.host + newPathname + "/data/density_individuals.txt");
  $("#dataFieldArea2").text("chr3 7680698 7680718 chr1 9185257 9185258\nchr4 9185278 19185278 chr2 13303770 13803670\n");
  $("#dataFieldArea3").load(window.location.protocol + "//" + window.location.host + newPathname + "/data/gwas.txt");
  load_circos();
}




//////////////////////////////////////////////////////////////////////////////

function load_mosaic(){
  $('#newTrackButton').click();
  $('#selectType0').val("Stack").change();
  $('#name0').val("Stack").change();
  //$("#dataFieldAreaC").text("chr1 38193400\nchr2 54522928\nchr3 32030951\nchr4 28191985\nchr5 29137935\nchr6 37293965\nchr7 29833120\nchr8 31585744\nchr9 22352177\nchr10 27624748\nchr11 33540656");
  $("#dataFieldAreaC").load("http://dev.visusnp.southgreen.fr/circosJS/demo/data/karyotype_banana.txt");
  $("#dataFieldArea0").load("http://dev.visusnp.southgreen.fr/circosJS/demo/data/all.tab2");

  //load_circos();


}  




//////////////////////////////////////////////////////////////////////////////
function updateFields(type, parent){
  switch(type){ 
    case "HeatMap":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr pos value value2...";
    break;
    case "HighLight":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr start end text text";
    break;
    case "Histogram":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr start end value";
    break;
    case "Chords":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr_source start end chr_dest start end";
    break;
    case "Line":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr pos value, value2...";
    break;
    case "Scatter":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr start end value";
    break;
    case "Stack":
    document.getElementById("help-block"+parent).innerHTML = "Data format : chr start end color";
    break;
    case "Text":
    document.getElementById("help-block"+parent).innerHTML = "Data format : 65464";
    break;
  } 
}
function generateSVG(){
  //get svg element.
  var svg = document.getElementById("svgdemo");

  //get svg source.
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(svg);

  //add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  //convert svg source to URI data scheme.
  var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

  //set url value to a element's href attribute.
  document.getElementById("download").href = url
  document.getElementById("download").download = "result.svg";
  document.getElementById("download").click();
}
function populateSelect(value){
  var select = document.getElementById("selectChr")
  var option = document.createElement("option");
  option.value = value;
  option.text = value;
  select.appendChild(option)
}

/////////////////////////// Color picker
$("#full").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
        
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});

//Function TEST


