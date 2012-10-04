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
  
  //Because ARC2 doesn't seem to identify turtle docs using chinese characters
  //this is a workaround while its being fixed in ARC2
  
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $u);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
  curl_setopt($ch,CURLOPT_HTTPHEADER,array ("Accept: text/turtle,text/n3q;0.9,application/turtle;q=0.8,application/rdf+xml;q=0.6,application/json;q=0.4,*/*"));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $data = curl_exec($ch);
  $content_type = array_shift(explode(";", curl_getinfo($ch, CURLINFO_CONTENT_TYPE)));  
  curl_close($ch);
  $parser = NULL;
  
  $parsers = array();
  $parsers[0]['formats'] = array('text/n3', 'application/x-turtle', 'application/turtle', 'text/turtle');
  $parsers[0]['parser']  = ARC2::getTurtleParser();
  $parsers[1]['formats'] = array('application/rdf+xml');
  $parsers[1]['parser']  = ARC2::getRDFXMLParser();
  $parsers[2]['formats'] = array('application/json', 'application/x-javascript', 'text/javascript', 'text/x-javascript', 'text/x-json');
  $parsers[2]['parser']  = ARC2::getJSONParser();
  foreach($parsers as $v){
    if(in_array($content_type, $v['formats'])){
      $parser = $v['parser'];
    }
  }
  //If nothing fits, pray to your favorite god that this can be detected and parsed correctly by ARC2.
  $parser = ARC2::getRDFParser();
  
  //end of workaround
  
  $parser->parse('http://example.org', $data); //Since IDK which namespace the documents contains, lets use example.org
  $triples = $parser->getTriples();
  $first=true;
  $c = 0;
  $nodes = array();
  $preds = array();
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
  	if(!isset($preds[uri2curie($t['s'])." ".uri2curie($t['o'])])){
  	  $preds[uri2curie($t['s'])." ".uri2curie($t['o'])] = uri2curie($t['p']);
  	}else{
  	  $preds[uri2curie($t['s'])." ".uri2curie($t['o'])] .= " ".uri2curie($t['p']);
  	}
  	
  }
  $results['links'] = array(); 
  foreach($triples as $t){
//    if(uri2curie($t['p']) !=  "rdf:type"){
  	$results['links'][] = array("source" => $nodes[$t['s']], "target" => $nodes[$t['o']], "name" => $preds[uri2curie($t['s'])." ".uri2curie($t['o'])], "value" => 10);
//    }
  }
  echo json_encode($results);
}else{
  header("HTTP/1.0 405 Method not allowed");
  echo "Please provide a url using the 'url' parameter\n\n"; 
}

?>
