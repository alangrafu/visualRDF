<?
$url = "http://alvaro.graves.cl";
if(isset($_GET['url'])){
  $url = $_GET['url'];
}
?>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="js/d3/d3.js"></script>
<script type="text/javascript" src="js/d3/d3.layout.js"></script>
<script type="text/javascript" src="js/d3/d3.geom.js"></script>
<script type="text/javascript">
var url = '<?=$url?>';
</script>
<link href='css/style.css' rel='stylesheet' type='text/css' />
<title>Visual RDF</title>
</head>
<body>
<div>
<h1 style="display: inline"><a href='.'>Visual RDF</a></h1>
  <div style="float:right">
  <form method="get" action="" style='float:left'>
    <input type='text' id='url' name='url' value='<?=$url?>' size='100'/>
    <input type="submit" value="Redraw"/>
  </form><div id="msg"><input type="checkbox" id="properties"/><label>Hide/Show properties</label>
  <img id="waiting" src="img/waiting.gif"/>
</div>
</div>
</div>
<div style="float: left;border-width: 1px; border-style: solid;width:100%" id='chart'></div>
<script type="text/javascript" src='js/main.js'>
</script>
</body>
</html>


