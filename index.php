<?
$url = get_current_url();//"about.ttl";
if(isset($_GET['url'])){
  $url = $_GET['url'];
}else{
  $indexless = str_replace("index.php", "", $url);
  header("Location: $indexless?url=$indexless");
  
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
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/bootstrap-modal.js"></script>
<script type="text/javascript" src="js/d3/d3.js"></script>
<script type="text/javascript" src="js/d3/d3.layout.js"></script>
<script type="text/javascript" src="js/d3/d3.geom.js"></script>
<script type="text/javascript">
var url = '<?=$url?>',
    thisUrl = document.URL;
</script>
<title>Visual RDF</title>
<style>
.control_button{
  fill: #357ebd;
  stroke: #428bca;
  border-radius: 4px;
}
</style>
</head>
<body>
<div class="container-fluid">
 <div class="row-fluid">
  <div class="span2"><h1 style="display: inline"><a href='.'>Visual RDF</a></h1></div>
  <div class="span2"><a href='https://github.com/alangrafu/visualRDF' target="_new"><img alt="github icon" src='img/github.ico'/></a></div>
  <div class="span2"><span id="dialogButton" style="text-decoration:none;vertical-align:middle;font-weight:bold;font-size:200%;font-family:courier;color:black;cursor: hand; cursor: pointer;">&lt;/&gt;</span></div>
  <div class="span6">
   <strong style="color: red">Usage: </strong> <strong>Scroll</strong> &#8594; Zoom. <strong>Drag node</strong> &#8594; Move node. <strong>Drag background</strong> &#8594; Move graph.
  </div>
 </div>
 <div class="row-fluid">
  <div class="span6">
   <form method="get" action="." class="form-inline">
    <input type='text' id='url' name='url' value='<?=$url?>' size='100'/>
    <input type="submit" class="btn" value="Redraw"/>
   </form>
  </div>
  <div class="span6">
   <form method="get" action="." class="form-inline">
    <input type="checkbox" checked id="properties"/>
      <label>Hide properties</label>
    <input type="checkbox" id="hidePredicates"/>
      <label>Hide predicates</label>
   <div id="preds" style="border: 1px solid black; position:absolute; display:none; color: white; background: rgba(0, 0, 0, 0.6);;"></div>
   </form>
  </div>
  <img id="waiting" alt="waiting icon" src="img/waiting.gif"/>
 </div>
</div>
<div style="float: left;border-width: 1px; border-style: solid;width:100%;min-height:500px;height:100%" id='chart'></div>
<script type="text/javascript" src='js/main.js'>
</script>

<div class="modal hide" id="embedDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Embed this code</h3>
  </div>
  <div class="modal-body">
    <pre id="embedableCode"></pre>
  </div>
  <div class="modal-footer">
    <a href="#" class="btn close" data-dismiss="modal">Close</a>
  </div>
</div>
<script type="text/javascript">
//Embed dialog
$("#dialogButton").on('click', function(){
  var newUrl = thisUrl.replace("index.php?url", "?url").replace(/\/\?/, "/embed.php?");
  $("#embedableCode").text("<div style='width:600px;height:460px'><iframe style='overflow-x: hidden;overflow-y: hidden;' frameborder='0'  width='100%' height='99%' src='"+newUrl+"'></iframe></div>")
  $("#embedDialog").show();
});
$(".close").on('click', function(){
  $("#embedDialog").hide();
});
</script>
<div style="border: 1px solid black; background: white;display:none;position: absolute;" id="literals">
  <h3 style="padding:5px;" id="literalsubject"></h3>
  <div style="padding:5px;" id="literalmsg"></div>
  <table class="table table-hover" id="literaltable">
    <thead>
      <tr>
        <th>Property</th><th>Value</th>
      </tr>
    </thead>
    <tbody id="literalbody">
    </tbody>
  </table>
</div>
</body>
</html>


