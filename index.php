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

<style type="text/css">
.link { stroke: #ccc; font-size: 11px; font-family: sans-serif; }
.nodetext { pointer-events: none; font-size: 11px; font-family: sans-serif; }
.main{border: 1px; border-color: black}
</style>
<link href='css/style.css' rel='stylesheet' type='text/css' />
<title>Visual RDF</title>
</head>
<body>
<h1>Visual RDF</h1>
<div>
  <form method="get" action="">
    <input type='text' id='url' name='url' value='<?=$url?>' size='100'/>
    <input type="submit" value="Redraw"/>
  </form><div id="msg">
  <img id="waiting" src="img/waiting.gif"/>
</div>
</div>
<div style="float: left;border-width: 1px; border-style: solid;width:100%" id='chart'></div>
<script type="text/javascript" src='js/main.js'>
</script>
</body>
</html>


