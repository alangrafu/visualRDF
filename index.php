<?
$url = "http://alvaro.graves.cl";
if(isset($_GET['url'])){
  $url = $_GET['url'];
}
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
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
<p style="display:inline; position:absolute"><small><a href='https://github.com/alangrafu/visualRDF'>Github Repository</a></small></p>
  <div style="float:right">
<div><strong style="color: red">Usage: </strong> <strong>Scroll</strong> &#8594; Zoom. <strong>Drag node</strong> &#8594; Move node. <strong>Drag background</strong> &#8594; Move graph.</div>
  <form method="get" action="." style='float:left'>
    <input type='text' id='url' name='url' value='<?=$url?>' size='100'/>
    <input type="submit" value="Redraw"/>
  </form><div id="msg"><input type="checkbox" id="properties"/><label>Show properties</label>
  <div style="display:inline"><input type="checkbox" id="hidePredicates"/><label>Hide predicates</label>
                       <div id="preds" style="border: 1px solid black; position:absolute; display:none; color: white; background: rgba(0, 0, 0, 0.6);;"></div>
</div>
  <img id="waiting" alt="waiting icon" src="img/waiting.gif"/>
</div>
</div>
</div>
<div style="float: left;border-width: 1px; border-style: solid;width:100%" id='chart'></div>
<script type="text/javascript" src='js/main.js'>
</script>
</body>
</html>


