var config = {
  organism: "dummy",
  orientation: "horizontal",
  ploidy: 2,
  ploidysize: 11,
  anotcolor: ["#6AC776", "#485150","#4A2D89"],
  chrMargin: 0, 
  ancestors: {
    "A": "#dea673",
    "B": "#7396be",
    "C": "#272727",
    "D": "#437343",
    "E": "#737373",
    "F": "#487646",
    "H": "#D3H4A2"
  },
  ploidyDesc: [],
  rangeSet: []
};
function colorpreset(){
  preset1 = {
    A : "#BBBBBB",
    B : "#7396be",
    C : "#EADED7",
    D : "#91605A",
    E : "#EADED7",
    F : "",
    G : "",
    H : "",
    ploidy : "#6AC776"
  };
  preset2 = {
    A : "#F1EDE7",
    B : "#8C8176",
    C : "#BC8751",
    D : "#B1BB8F",
    E : "#F06053",
    F : "",
    G : "",
    H : "",
    ploidy : "#485150"
  }
  preset3 = {
    A : "#D9ABB5",
    B : "#C29BB6",
    C : "#242025",
    D : "#C0A58A",
    E : "#EADED7",
    F : "",
    G : "",
    H : "",
    ploidy : "#4A2D89"
  };
}
function initploidydesc(){
  switch(config.ploidy) {
    case "2":
    var ploidytext="AA";
    break;
    case "3":
    var ploidytext="AAA";
    break;
    case "4":
    var ploidytext="AAAA";
    break;
    case 2:
    var ploidytext="AA";
    break;
    case 3:
    var ploidytext="AAA";
    break;
    case 4:
    var ploidytext="AAAA";
    break;
  }
  config.ploidyDesc = [];
  for (var i = 0; i < config.ploidysize; i++) {
    config.ploidyDesc.push(ploidytext);
  }
}
function initColorAnnot(){
  for(var key in config.ancestors){
    if($("#selectorpreset :selected").val() == "preset1"){
      config.ancestors[key] = preset1[key];
    }else if ($("#selectorpreset :selected").val() == "preset2"){
      config.ancestors[key] = preset2[key];
    }else{
      config.ancestors[key] = preset3[key];
    }
  }
  if($("#selectorpreset :selected").val() == "preset1"){
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset1.ploidy;
    }
  }else if ($("#selectorpreset :selected").val() == "preset2"){
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset2.ploidy;
    }
  }else{
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset3.ploidy;
    }
  } 
}
function chromosomeParser(data){
 var split = data.split("\n");
 var localsplit  = "";
 var data = "";
 var localchr="";
 config.ploidysize = split.length;
 for (var i = 0; i < split.length; i++) {
  localsplit = split[i].split(" ");
    //LocalSplit[0] = chromosome choisi, localsplit[1] = longeur du chromosome
    localchr = "\""+localsplit[0]+" p 1 0 "+localsplit[1]+" 0 "+localsplit[1]+"\"\,";
    data += localchr;
    localchr = "\""+localsplit[0]+" p 1 0 "+localsplit[1]+" "+localsplit[1]+" "+localsplit[1]+"\"\,";
    data += localchr;
  }
  initploidydesc();
  return data;
}
function chromosomeParserNP(data){
 var split = data.split("\n");
 var localsplit  = "";
 var data = "";
 var localchr="";
 config.ploidysize = split.length;
 for (var i = 0; i < split.length; i++) {
  localsplit = split[i].split(" ");
    //LocalSplit[0] = chromosome choisi, localsplit[1] = longeur du chromosome
    localchr = "\""+localsplit[0]+" p 1 0 "+localsplit[1]+" 0 "+localsplit[1]+"\"\,";
    data += localchr;
    localchr = "\""+localsplit[0]+" p 1 0 "+localsplit[1]+" "+localsplit[1]+" "+localsplit[1]+"\"\,";
    data += localchr;
  }
  return data;
}
function annotationParser(data){
  $("#editorannot").text(data);
  var split = data.split("\n");
  var localsplit  = "";
  var data = "";
  var localannot="";
  config.rangeSet = [];
  for (var i = 0; i < split.length; i++) {
    localsplit = split[i].split(" ");
    newAnnotationLoad(localsplit[0], localsplit[1], localsplit[2], localsplit[3], localsplit[4]);
    //
  }
}
function newAnnotationLoad(chromosome, haplotype, begin, end, color){
  colorpreset();
  var ploidy=[];
  for(var i = 0; i< config.ploidy; i++){

    if(i == haplotype){
      ploidy.push(1);
    }else {
      ploidy.push(0);
    }
  }
  chromosome = {
    chr: chromosome,
    ploidy: ploidy,
    start: begin,
    stop: end,
    color: getAnnotColor(color)
  };
  config.rangeSet.push(chromosome);
  reload();
}
function getAnnotColor(color){
  return config.anotcolor[color];
}
function reload(){
  removeanotationconf();
  initanotations();
  removeploidyconf();
  initploidy();
  updateIdeogram();
}
function colorchange(){
  for(var key in config.ancestors){
    if($("#selectorpreset :selected").val() == "preset1"){
      config.ancestors[key] = preset1[key];
    }else if ($("#selectorpreset :selected").val() == "preset2"){
      config.ancestors[key] = preset2[key];
    }else{
      config.ancestors[key] = preset3[key];
    }  
  }
  if($("#selectorpreset :selected").val() == "preset1"){
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset1.ploidy;
    }
  }else if ($("#selectorpreset :selected").val() == "preset2"){
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset2.ploidy;
    }
  }else{
    for(var i = 0; i<config.rangeSet.length; i++){
      config.rangeSet[i].color = preset3.ploidy;
    }
  } 
  removecolorselect();
  //initcolorselect();
  updateIdeogram();
}
function getPresetColor(param){
  if($("#selectorpreset :selected").val() == "preset1"){
    return preset1[param];
  }else if ($("#selectorpreset :selected").val() == "preset2"){
    return preset2[param];
  }else{
    return preset3[param];
  }
}
function updatepos(anot,position){
  for(var i = 0; i<config.rangeSet[anot].ploidy.length; i++){
    if(i == (position-1)){
      config.rangeSet[anot].ploidy[i]=1;
    }else {
      config.rangeSet[anot].ploidy[i]=0;
    }
  }
  reload();
}
function updatestart(anot,start){
  config.rangeSet[anot].start = start;
  reload();
}
function updatestop(anot,stop){
  config.rangeSet[anot].stop = stop;
  reload();
}
function updateploidy(value){
  console.log(value)
  config.ploidy = value;
  initploidydesc();
  /*if($("#chrcolor").is(":visible")){
    removeanotationconf();
    initanotations();
    removecolorselect();
    //initcolorselect();
    
  }*/
  reload();
}
function newAnnotation(){
  var chromosome=[];
  var ploidy=[];
  var position = $("#posnew").val()-1;
  for(var i = 0; i< config.ploidy; i++){
    if(i == position){
      ploidy.push(1);
    }else {
      ploidy.push(0);
    }
  }

  chromosome = {
    chr: $("#chrnew").val(),
    ploidy: ploidy,
    start: $("#startnew").val(),
    stop:$("#stopnew").val(),
    color: getPresetColor("ploidy")
  };

  config.rangeSet.push(chromosome);
  reload();
}
function addAnnotation(){
  var n = document.getElementById("annotationconf");

  var tr = document.createElement('tr');
  var td = document.createElement('td');


  td = document.createElement('td');
  x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("id","chrnew");
  x.setAttribute("size", "2");
  td.appendChild(x);
  tr.appendChild(td);

  td = document.createElement('td');
  var x = document.createElement("select");
  x.setAttribute("class", "")
  x.setAttribute("id", "posnew");

  for(var i=0; i<config.ploidy;i++){
    var option = document.createElement('option');
    option.value = i+1;
    option.text= i+1;
    x.appendChild(option)
  }
  td.appendChild(x);
  tr.appendChild(td);

  td = document.createElement('td');
  x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("id","startnew");
  td.appendChild(x);
  tr.appendChild(td);

  td = document.createElement('td');
  x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("id","stopnew");
  td.appendChild(x);
  tr.appendChild(td);


  td = document.createElement('td');
  x = document.createElement("a");
  x.setAttribute("class", "btn btn-link");
  x.setAttribute("id","addnew");
  x.setAttribute("onclick","newAnnotation()");
  td.appendChild(x);
  tr.appendChild(td);

  //To DO color select
  n.appendChild(tr);
  var button = document.getElementById("addnew");
  button.innerHTML = "Add";
}
function initanotations(){

  for(var anot = 0; anot<config.rangeSet.length; anot++){
   var n = document.getElementById("annotationconf");

   var tr = document.createElement('tr');
   var td = document.createElement('td');
   td.appendChild(document.createTextNode(config.rangeSet[anot].chr))
   td.setAttribute('id', 'anotconf'+anot);
   tr.appendChild(td)
   td = document.createElement('td');
   var x = document.createElement("select");
   x.setAttribute("class", "")
   x.setAttribute("id", "selectpotition"+anot);
   x.setAttribute("onchange","updatepos(\""+anot+"\",this.value)");

   for(var i=0; i<config.rangeSet[anot].ploidy.length;i++){
    var option = document.createElement('option');
    option.value = i+1;
    option.text= i+1;
    if(config.rangeSet[anot].ploidy[i]==1){
      option.setAttribute('selected','');
    }
    x.appendChild(option)
  }
  td.appendChild(x);
  tr.appendChild(td);


  td = document.createElement('td');
  x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("value", config.rangeSet[anot].start);
  x.setAttribute("onchange","updatestart(\""+anot+"\",this.value)");
  td.appendChild(x);
  tr.appendChild(td);

  td = document.createElement('td');
  x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("value", config.rangeSet[anot].stop);
  x.setAttribute("onchange","updatestop(\""+anot+"\",this.value)");
  td.appendChild(x);
  tr.appendChild(td);
  
  //Color part
/*
  td = document.createElement('td');
  var div2 = document.createElement('div');
  div2.setAttribute("class","col-lg-10");
  var div3 = document.createElement('div');
  div3.setAttribute("id","cpa"+anot);
  div3.setAttribute("class","input-group colorpicker-component");
  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("size","8");
  input.setAttribute("class","form-control");
  input.setAttribute("id","cpia"+i);
  input.setAttribute("onchange"," config.rangeSet[\""+anot+"\"].color = this.value; updateIdeogram();");
  var span = document.createElement('span');
  span.setAttribute("class","input-group-addon");
  var divi = document.createElement('i');
  span.appendChild(divi);
  div3.appendChild(input);
  div3.appendChild(span);
  div2.appendChild(div3);
  td.appendChild(div2);
  tr.appendChild(div2); 
  $(function() {
    $('#cpa'+anot).colorpicker({
      color: config.rangeSet[anot].color,
      format: 'hex'
    });
  });*/
   // 
   n.appendChild(tr);
 }
 addAnnotation();
}
function initanotationhead(){
  $('#annotationdiv').fadeIn('slow');
  var n = document.getElementById("annotationhead");
  var th = document.createElement('th');
  th.appendChild(document.createTextNode("Chr"));
  n.appendChild(th);
  th = document.createElement('th');
  th.appendChild(document.createTextNode("Position"));
  n.appendChild(th);
  th = document.createElement('th');
  th.appendChild(document.createTextNode("Start"));
  n.appendChild(th);
  th = document.createElement('th');
  th.appendChild(document.createTextNode("Stop"));
  n.appendChild(th);
  th = document.createElement('th');
  th.appendChild(document.createTextNode("Color"));
  n.appendChild(th);
}
function load_file(){
  $("#fileInput").show();
  colorpreset();
  var fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
     //initcolorselect();
     loadIdeogram(chromosomeParser(reader.result), config.ploidy);
     initploidy();
     initanotations();
     initanotationhead();
     $('#download').fadeIn('slow');
     $("#editor").text(reader.result);
     $("#fileInput").hide();
   };
   reader.readAsText(file);  
 });   
}
function load_post_file(input){
  colorpreset();
  loadIdeogram(chromosomeParser(input), config.ploidy);
  initploidy();
  initanotations();
  initanotationhead();
  $('#download').fadeIn('slow');
  $("#editor").text(input);
  //$("#fileInput").hide();  
}
function clear(){
  var element = document.getElementById("_ideogram");
  if(element != null){
    element.parentNode.removeChild(element);
  }
}
function repositione(){
  setTimeout(function(){
    var ideo = document.getElementById("_ideogram");
    var tideo = document.getElementById("targetideo");
    tideo.appendChild(ideo);
  }, 50);
}
function loadIdeogram(result,ploidy){
  clear()
  eval("chrBands = ["+result+"]");
  var patate = ploidy;
  var ideogram = new Ideogram(config);
  repositione();
}
function addPloidy(){
  var n = document.getElementById("ploidyconf");
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(config.ploidyDesc.length))
  td.setAttribute('id', 'ploidydesc'+config.ploidyDesc.length);
  tr.appendChild(td)
  var td2 = document.createElement('td');
  var x = document.createElement("input");
  x.setAttribute("type", "text");
  x.setAttribute("value", "");
  td2.appendChild(x);
  tr.appendChild(td2);
  n.appendChild(tr);
}
function removeanotationconf(){

  $('#annotationconf').html('');
}
function removeploidyconf(){
  $('#ploidyconf').html('');
}
function removecolorselect(){

  $('#chrcolor').html('');
}
function generateSVG(){
  //get svg element.
  var svg = document.getElementById("_ideogram");

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
function initcolorselect(){
  var div = document.getElementById("chrcolor");
  var i=1;
  for(var key in config.ancestors){
    if (i<=config.ploidy){
      var label = document.createElement('label');
      label.setAttribute("for","cp"+i);
      label.setAttribute("class","col-lg-2 control-label");
      label.innerHTML = "Chr "+key;
      div.appendChild(label);

      var div2 = document.createElement('div');
      div2.setAttribute("class","col-lg-10");

      var div3 = document.createElement('div');
      div3.setAttribute("id","cp"+i);
      div3.setAttribute("class","input-group colorpicker-component");

      var input = document.createElement('input');
      input.setAttribute("type","text");
      input.setAttribute("size","8");
      input.setAttribute("class","form-control");
      input.setAttribute("id","cpi"+i);
      input.setAttribute("onchange"," config.ancestors[\""+key+"\"] = this.value; updateIdeogram();")

      var span = document.createElement('span');
      span.setAttribute("class","input-group-addon");

      var divi = document.createElement('i');

      span.appendChild(divi);

      div3.appendChild(input);
      div3.appendChild(span);
      div2.appendChild(div3);
      div.appendChild(div2);
      
      $(function() {
        $('#cp'+i).colorpicker({
          color: config.ancestors[key],
          format: 'hex'
        });
      });
      i++;
    }
  }
  displaycolor();
}
function displayploidy(){
  var element = document.getElementById("buttonploidy");
  if($("#tableploidy").is(":visible")){
    $("#tableploidy").fadeOut('slow');
    element.innerHTML = "Afficher le contenu";
  }else{
    $('#tableploidy').fadeIn('slow');
    element.innerHTML = "Masquer le contenu";
  }
}
function displaycolor(){

  $('#chrcolor').fadeIn('slow')
}
function updateletters(pos,value){
  config.ploidyDesc[pos] = value;
  loadIdeogram(chromosomeParserNP(getEditorText()),config.ploidy);
}
function initploidy(){
  if(config.ploidy>2){
    showploidybutton();
    var n = document.getElementById("ploidyconf");
    for (var i = 1; i < config.ploidyDesc.length ; i++) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(i))
      td.setAttribute('id', 'ploidydesc'+i);
      tr.appendChild(td)
      var td2 = document.createElement('td');
      var x = document.createElement("input");
      x.setAttribute("type", "text");
      x.setAttribute("value", config.ploidyDesc[i]);
      x.setAttribute("onchange","updateletters(\""+(i-1)+"\",this.value)");
      td2.appendChild(x);
      tr.appendChild(td2);
      n.appendChild(tr);
    }
    $("#ploidyconfdiv").fadeIn('slow');
  }else{
    $('#ploidyconfdiv').hide();
  }
}
function showploidybutton(){

  $('#buttonploidy').fadeIn('slow');
}
function displaytext(value){
  var letters = document.getElementsByClassName("chrLabel");
  for (i = 0; i < letters.length; i++) { 
    letters[i].style.display=value;
  }
}
function updateIdeogram(){

  loadIdeogram(chromosomeParser(getEditorText()),config.ploidy);
}
function getEditorAnnotText(){

  return $("#editorannot").text();
}
function setEditorAnnotText(value){

  return $("#editorannot").text(value);
}
function getEditorText(){

  return $("#editor").text();
}
function setEditorText(value){
  return $("#editor").text(value);
}