<?
$url = get_current_url();//"about.ttl";
if(isset($_GET['url'])){
  $url = $_GET['url'];
}



function get_current_url() {
    $protocol = 'http';
    if ($_SERVER['SERVER_PORT'] == 443 || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on')) {
        $protocol .= 's';
        $protocol_port = $_SERVER['SERVER_PORT'];
    } else {
        $protocol_port = 80;
    }
    $host = $_SERVER['HTTP_HOST'];
    $port = $_SERVER['SERVER_PORT'];
    $request = $_SERVER['PHP_SELF'];
    $query = substr($_SERVER['argv'][0], strpos($_SERVER['argv'][0], ';') + 1);
    $toret = $protocol . '://' . $host . ($port == $protocol_port ? '' : ':' . $port) . $request . (empty($query) ? '' : '?' . $query);
    return $toret;
}
?>
<!DOCTYPE html>
<html
xmlns:foaf="http://xmlns.com/foaf/0.1/"
xmlns:dc="http://purl.org/dc/elements/1.1/">
<head>
<meta rel="dc:creator" href="http://alvaro.graves.cl" /> 
<meta rel="dc:source" href="http://github.com/alangrafu/visualRDF" /> 
<meta property="dc:modified" content="2012-05-18" /> 
<meta charset='utf-8'> 
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
 <div style="float:left">
 <div style="font-size:70%">
   <strong style="color: red">Usage: </strong> <strong>Scroll</strong> &#8594; Zoom. <strong>Drag node</strong> &#8594; Move node. <strong>Drag background</strong> &#8594; Move graph.
   <input type="checkbox" checked id="properties"/><label>Hide properties</label>
    <input type="checkbox" id="hidePredicates"/><label>Hide predicates</label>
  </div>
    <div id="preds" style="border: 1px solid black; position:absolute; display:none; color: white; background: rgba(0, 0, 0, 0.6);;"></div>
   <img id="waiting" alt="waiting icon" src="img/waiting.gif"/>
 </div>
 <div style="float:left;width:100%; height:100%;min-height:400px;border:solid 1px black" id='chart'></div>
 <div style="font-size:70%;float:right">
  <a href='./?url=<?=$url?>' target="_blank">See this in visualRdf</a>
 </div>
 <script type="text/javascript" src='js/main.js'></script>
</body>
</html>


