<!DOCTYPE html> 
<html>
<head>
  <title>EVA-00</title>
  <meta charset="utf-8">
  <script src="https://code.jquery.com/jquery-3.2.1.js" integrity="sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=" crossorigin="anonymous"></script>

  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/sandstone/bootstrap.min.css" rel="stylesheet" integrity="sha384-G3G7OsJCbOk1USkOY4RfeX1z27YaWrZ1YuaQ5tbuawed9IoreRDpWpTkZLXQfPm3" crossorigin="anonymous">
  <link type="text/css" rel="stylesheet" href="dist/css/ideogram.css"/>
  <link type="text/css" rel="stylesheet" href="dist/css/bootstrap-colorpicker.css"/>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.1.1/d3.min.js"></script>
  <script type="text/javascript" src="dist/js/ideogram.js"></script>
  <script type="text/javascript" src="dist/js/bootstrap-colorpicker.js"></script>

  <script type="text/javascript" src="dist/js/loadideogram.js"></script>
</head>
<style type="text/css">
  #fileInput {
    display: none;
  }
  .dropdown-menu {

    width: 500px;
  }
  .dropdown-submenu {

    width: 500px;
  }

  .dropdown-submenu>.dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -6px;
    margin-left: -1px;
    -webkit-border-radius: 0 6px 6px 6px;
    -moz-border-radius: 0 6px 6px;
    border-radius: 0 6px 6px 6px;
  }

  .dropdown-submenu:hover>.dropdown-menu {
    display: block;
  }

  .dropdown-submenu>a:after {
    display: block;
    content: " ";
    float: right;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 5px 0 5px 5px;
    border-left-color: #ccc;
    margin-top: 5px;
    margin-right: -10px;
  }

  .dropdown-submenu:hover>a:after {
    border-left-color: #fff;
  }

  .dropdown-submenu.pull-left {
    float: none;
  }

  .dropdown-submenu.pull-left>.dropdown-menu {
    left: -100%;
    margin-left: 10px;
    -webkit-border-radius: 6px 0 6px 6px;
    -moz-border-radius: 6px 0 6px 6px;
    border-radius: 6px 0 6px 6px;
  }


  .cd-top.cd-is-visible {
    /* the button becomes visible */
    visibility: visible;
    opacity: 1;
  }
  .cd-top.cd-fade-out {
    /* if the user keeps scrolling down, the button is out of focus and becomes less visible */
    opacity: .5;
  }
</style> 
<body>
  <!--NAVBAR CONTAINER-->


  <div class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
      <div class="collapse navbar-collapse">
        <!--<ul class="nav navbar-nav navbar-right">
          <li><a href="https://github.com/fontenele/bootstrap-navbar-dropdowns" target="_blank">GitHub Project</a></li>
        </ul>-->
        <ul class="nav navbar-nav">
          <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">General<b class="caret"></b></a>
            <ul class="dropdown-menu multi-level">
              <li>
                <div class="form-group">
                  <div class="form-group">
                    <label for="userUrl" class="col-lg-4 control-label">Url(optional) :</label>
                    <div class="col-lg-7">
                     <input id="userUrl" wrap="off" rows=4 class="form-control" placeholder="Insert URL"></input>
                   </div>
                   <div id="modalContent"></div>
                   <div id="urlFinal"></div>
                 </div>
                 <br>
                 <div class="form-group">
                   <label for="dataFieldAreaC" class="col-lg-4 control-label">Chromosome data*</label>
                   <div class="col-lg-7">
                    <textarea id="dataFieldAreaC" wrap="off" rows="5" class="form-control" placeholder="Insert values here"></textarea>
                    <span class="help-block">Each entry must be separated by carriage return :<br>
                      <b>chr0 length #color</b>
                      <br>
                      <b>chr1 length #color</b></span>
                    </div>
                  </div>

                  <button class="btn btn-primary col-lg-6 col-lg-offset-4" onclick="load_file(this.value)" id="newLoadDataC" value="C">Load Data</button>
                  <br>
                  <input class="btn btn-warning col-lg-6 col-lg-offset-4" type="file" style="display:none;" id="fileInputC">
                  <h5 id="parC" class=" col-lg-offset-5"></h5>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Tracks <b class="caret"></b></a>
            <ul class="dropdown-menu multi-level" role="menu" id="tracks_content" aria-labelledby="dropdownMenu">         
            </ul>
          </li>

        </ul>
        <div class="navbar-form navbar-left" role="search">
          <button class="btn btn-primary" id="newTrackButton">Add new track</button>
          <button class="btn btn-warning" onclick="load_test()" id="load_test">Test data</button>
          <button class="btn btn-danger" onclick="load_circos()" style="display:none;" id="loadCircos">Load Circos</button>
          <a id="download" class="btn btn-warning" onclick="generateSVG()">Download</a>
        </div>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <button class="btn btn-danger" style="display:none;" id="resetZoom"> Reset Zoom</button>
            <button href="#0" style="display:none;" class="btn-success cd-top">Back to Top</button>
          </li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>
  <!-- END OF NAVBARCONTAINER-->



  
  <div class="row">
    <div class="col-md-7">
      <div class="col-lg-7">

        <p class="bs-component">
          <button class="btn btn-primary" onclick="load_file();" id="load">Load</button>
          <button class="btn btn-warning" onclick="location.reload();" id="clear">Clear</button>
          
          <!--  btn-lg btn-block-->
          <a id="download" style="display: none;" class="btn btn-warning" onclick="generateSVG()">Download</a>
          <input class="btn btn-info" type="file" id="fileInput">
        </p>
        <p class="bs-component">

        </p>
        <p class="bs-component" id="targetideo">
        </p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="form-horizontal">
        <fieldset>
          <legend>Legend</legend>
          <div class="form-group">
            <label for="selectorpreset" class="col-lg-2 control-label">Color Preset</label>
            <div class="col-lg-10">
              <select name="select" id="selectorpreset" onchange="colorchange();" class="form-control">
                <option value="preset1" selected>Preset 1</option> 
                <option value="preset2">Preset 2</option>
                <option value="preset3">Preset 3</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="selectorploidy" class="col-lg-2 control-label">Ploïdie</label>
            <div class="col-lg-10">
              <select name="select" id="selectorploidy" onchange="updateploidy(this.value);" class="form-control">
                <option value="2" selected>2</option> 
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          <div style="display: none;" class="form-group" id="ploidyconfdiv" >
            <label for="tableploidy" class="col-lg-2 control-label">Ploidy Configuration</label>
            <div class="col-lg-10">
              <button style="display: none;" class="btn btn-default btn-lg btn-block" id="buttonploidy" onclick="displayploidy()">Afficher le contenu <span class="caret"></span></button>
              <br>
              <table style="display: none;" id="tableploidy" class="table table-striped table-hover ">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ploidy</th>
                  </tr>
                </thead>
                <tbody id="ploidyconf">
                  <!-- Here goes Script for ploidy numbersss-->
                </tbody>
              </table> 
            </div>
          </div>

          <div class="form-group">
            <label for="editorannot" class="col-lg-2 control-label">Annotations</label>
            <div class="col-lg-10">
              <textarea id="editorannot" rows="5" class="form-control" placeholder="Insert values here" onchange="annotationParser(this.value)"></textarea>
              <span class="help-block">Les données doivent être au format suivant : "chr pos start stop color",...</span>
            </div>
          </div>

          <div class="form-group">
            <label for="editor" class="col-lg-2 control-label">Data</label>
            <div class="col-lg-10">
              <textarea id="editor" rows="5" class="form-control" placeholder="Insert values here" onchange="loadIdeogram(chromosomeParser(this.value), config.ploidy);"></textarea>
              <span class="help-block">Les données doivent être au format suivant : "1 p 1 0 647 0 2908818",...</span>
            </div>
          </div>
          <!--
          <div class="form-group">
            <label for="chrInput" class="col-lg-2 control-label">Chr Size</label>
            <div class="col-lg-10">
              <input type="text" class="form-control" value="" id="chrInput" placeholder="Chr size">
            </div>
          </div>
        -->

        <div class="form-group" style="display: none;" id="chrcolor">
          <!-- Here goes code that displays the color selector --> 
        </div>

        <div style="display: none;" id="annotationdiv" class="form-group">
          <label for="editor" class="col-lg-2 control-label">Annotations Configuration</label>
          <div class="col-lg-10">
            <table class="table table-striped table-hover ">
              <thead>
                <tr id="annotationhead">
                 <!-- Here goes initanotationshead-->
               </tr>
             </thead>
             <tbody id="annotationconf">
              <!-- Here goes initanotations-->
            </tbody>
          </table> 
        </div>
      </div>
      
      <div class="form-group">
        <label class="col-lg-2 control-label">Letters</label>
        <div class="col-lg-10">
          <div class="radio">
            <label>
              <input type="radio" name="optionsRadios" id="optionsRadios1" value="inline" onclick="displaytext(this.value)" checked="">
              Show
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="optionsRadios" id="optionsRadios2" onclick="displaytext(this.value)" value="none">
              Hide
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</div> 
<?php
//echo json_encode(file_get_contents($_POST["data"]));
//echo $_POST["select"];

if(isset($_FILES["data"])){
  $data = json_encode(file_get_contents($_FILES["data"]["tmp_name"]));
  $ploidyPost = $_POST["select"];
  echo "<script>
  config.ploidy = $ploidyPost;
  $(\"#selectorploidy\").val('$ploidyPost');
  var datajs = {$data};
  datajs = datajs.substring(0, datajs.length-1);
  console.log(datajs);
  $('#editorChr).val(datajs);
  //load_post_file(datajs); 
</script>";
if(!empty($_FILES["annot"])){
  $annot = json_encode(file_get_contents($_FILES["annot"]["tmp_name"]));
  echo "<script> 
  var annotjs = {$annot};
  annotjs = annotjs.substring(0, annotjs.length-1);
  console.log(annotjs);
  annotationParser(annotjs); 
//</script>";
}
}
?>
</div>
</body>
</html>

