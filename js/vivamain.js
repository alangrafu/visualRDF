$(document).ready(function(){
    checkSupport = function() {
      if (window.WebGLRenderingContext) {
        var elem = document.createElement('canvas');
        
        if (!elem.getContext || !elem.getContext('experimental-webgl')) {
          $('#webglsupport').show();
          return false;
        }
        return true; 
      }
      return false;
    },
    
    webglSupported = checkSupport();
    var graph = Viva.Graph.graph();

               var layout = Viva.Graph.Layout.forceDirected(graph, {
                   springLength : 100,
                   springCoeff : 0.0008,
                   dragCoeff : 0.02,
                   gravity : -1.2
               });
                
        var graphics = webglSupported ? Viva.Graph.View.webglGraphics() : Viva.Graph.View.svgGraphics();
    $.ajax({
        url: 'rdf2json.php?url='+encodeURIComponent(url),
        dataType: 'json',
        success: function(data){
          $("#waiting").hide();    
          //Add nodes
          $.each(data.nodes, function(i, item){
              graph.addNode(item.name, {id: item.name, background: "red"});
          });
          
          //Add edges
          $.each(data.links, function(i, item){
              graph.addLink(item.source, item.target);
          });
          
          
          var renderer = Viva.Graph.View.renderer(graph,
                   {
                       graphics   : graphics,
                       container  : document.getElementById('chart'),
                       renderLinks : true
                   });
          graph.forEachNode(function(node){
              console.log(node.id, node.data);
          });
          renderer.run();
        }
    });
    
    
});
