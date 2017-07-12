<!DOCTYPE html> 
<html>
<head> 
  <title>Client Web pour Ideogram</title>
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
<body>
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
    .navbar{
      position: absolute;
    }
  </style> 
</style> 
<h1></h1>

<!--NAVBAR CONTAINER-->


<div class="navbar navbar-default navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="collapse navbar-collapse">
        <!--<ul class="nav navbar-nav navbar-right">
          <li><a href="https://github.com/fontenele/bootstrap-navbar-dropdowns" target="_blank">GitHub Project</a></li>
        </ul>-->
        <ul class="nav navbar-nav">
        <li id="potatosalad">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Chromosomes<b class="caret"></b></a>
            <ul class="dropdown-menu">

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
              <br>
              <br>
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
              <br>
              <br>
              <div class="form-group">
                <label for="editorChr" class="col-lg-2 control-label">Data</label>
                <div class="col-lg-10">
                  <textarea id="editorChr" rows="5" class="form-control" onchange="load_ideogram()" placeholder="Insert values here"></textarea>
                  <span class="help-block">Les données doivent être au format suivant : "chr length</span>
                </div>
              </div>
              
            </ul>
          </li>
          <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Data<b class="caret"></b></a>
            <ul class="dropdown-menu multi-level" role="menu" id="tracks_content" aria-labelledby="dropdownMenu"> 
              <div class="form-group">
                <label for="editorAnnot" class="col-lg-3 control-label">Annotations</label>
                <div class="col-lg-9">
                  <textarea id="editorAnnot" rows="5" class="form-control" onchange="load_ideogram()" placeholder="Insert values here" ></textarea>
                  <span class="help-block">Les données doivent être au format suivant : "chr pos start stop color",...</span>
                </div>
              </div>
              <br>
              <br>
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
            </ul>

          </li>

        </ul>
        <div class="navbar-form navbar-left" role="search">
          <button class="btn btn-primary" onclick="load_file();" id="load">Load</button>
          <button class="btn btn-primary" onclick="load_test();" id="testData">Test</button>
          <button class="btn btn-warning" onclick="location.reload();" id="clear">Clear</button>
          <a id="download" style="display: none;" class="btn btn-warning" onclick="generateSVG()">Download</a>
          <input class="btn btn-info" type="file" id="fileInput">
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
  <br>
  <br>
  <br>
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
    load_post_file(datajs); 
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
  echo "<script> load_ideogram()</script>";
}
elseif(isset($_POST["data"])){
  $data = json_encode(file_get_contents($_POST["data"]));
  $ploidyPost = $_POST["select"];
  echo "<script>
  config.ploidy = $ploidyPost;
  $(\"#selectorploidy\").val('$ploidyPost');
  var datajs = {$data};
  datajs = datajs.substring(0, datajs.length-1);
  $(\"#editorChr\").text(datajs);
</script>";
if(!empty($_POST["annot"])){
  $annot = json_encode(file_get_contents($_POST["annot"]));
  echo "<script>
  var annotjs = {$annot};
  annotjs = annotjs.substring(0, annotjs.length-1);
  console.log(annotjs);
  $(\"#editorAnnot\").text(annotjs);
//</script>";
}
echo "<script> load_ideogram()</script>";
}
?>
</div>
</body>
</html>

