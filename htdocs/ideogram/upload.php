<form action="index.php" method="post" enctype="multipart/form-data">
	Select Data :
	<input type="file" name="data" id="data">
	<br>
	Select Annotations :
	<input type="file" name="annot" id="annot">
	<br>
	Ploidy : 
	<select name="select" id="selectorpost">
		<option value="2" selected>2</option>  
		<option value="3">3</option>
		<option value="4">4</option>
	</select>
	<input type="submit" value="Upload" name="submit">
</form>
<!--
<form action="http://dev.visusnp.southgreen.fr/ideogram/index.php" method="post">
<input type="hidden" name="data" id="data" value="http://cc2-web1.cirad.fr/galaxydev/static/style/ideogram/dataset_19804.dat" />
	<input type="hidden" name="annot" id="annot" value="http://cc2-web1.cirad.fr/galaxydev/static/style/ideogram/dataset_19803.dat" />
	<input type="hidden" name="select" id="selectorpost" value="3" />
	<input type="submit" style="display: none;" id="load" value="reload">
</form>
-->
<script>
	document.getElementById("load").click();
</script>