<?
include_once('namespaces.php');
function uri2curie($uri){
  global $ns;
  $curie = $uri;
  foreach($ns as $k => $v){
  	$curie = preg_replace("|^$v|", "$k:", $uri);
  	if($curie != $uri){
  	  break;
  	}
  }
  return $curie;
}


$results = array();  
if(isset($_GET['url'])){
  $u = $_GET['url'];
  include_once('arc2/ARC2.php');
  $parser = ARC2::getRDFParser();
  $parser->parse($u);
  $triples = $parser->getTriples();
  $first=true;
  $c = 0;
  $nodes = array();
  $results['nodes'] = array();
  foreach($triples as $t){
  	if(!isset($nodes[$t['s']])){
  	  $nodes[$t['s']] = $c++;
  	  $results['nodes'][] = array("name" => uri2curie($t['s']), "uri" => $t['s'], "type" => $t['s_type']);
  	}
  	if(!isset($nodes[$t['o']])){
  	  $nodes[$t['o']] = $c++;
  	  $results['nodes'][] = array("name" => uri2curie($t['o']), "uri" => $t['o'], "type" => $t['o_type']);
  	}
  }
  $results['links'] = array(); 
  foreach($triples as $t){
  	$results['links'][] = array("source" => $nodes[$t['s']], "target" => $nodes[$t['o']], "name" => uri2curie($t['p']), "value" => 10);
  }
  echo json_encode($results);
}else{
  header("HTTP/1.0 405 Method not allowed");
  echo "Please provide a url using the 'url' parameter\n\n"; 
}

?>
