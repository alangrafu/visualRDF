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
<link href='css/bootstrap-responsive.min.css' rel='stylesheet' type='text/css' />
<link href='css/bootstrap.min.css' rel='stylesheet' type='text/css' />
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/vivagraph.js"></script>
<script type="text/javascript">
var url = '<?=$url?>';
</script>
        <style type='text/css'>
            .node {
                background-color: #00a2e8;
                width: 10px;
                height: 10px;
                position: absolute;
            }
            .link {
                background-color: #dddddd;
                position: absolute;
            }
            .nodetext{
                font-family: sans-serif;
                font-size: 10px;
            }
            
 </style><title>Visual RDF</title>
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
  </form><div id="msg"><input type="checkbox" checked id="properties"/><label>Hide properties</label>
  <div style="display:inline"><input type="checkbox" id="hidePredicates"/><label>Hide predicates</label>
                       <div id="preds" style="border: 1px solid black; position:absolute; display:none; color: white; background: rgba(0, 0, 0, 0.6);;"></div>
</div>
  <img id="waiting" alt="waiting icon" src="img/waiting.gif"/>
</div>
</div>
</div>
<div style="float: left;border-width: 1px; border-style: solid;width:100%; height:400px" id='chart'>
</div>
<script type="text/javascript" src='js/vivamain.js'>
</script>
</body>
</html>


