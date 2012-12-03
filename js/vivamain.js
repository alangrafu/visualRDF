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
    
    var graphics = webglSupported ? Viva.Graph.View.webglGraphics() : Viva.Graph.View.svgGraphics();
  graphics = Viva.Graph.View.svgGraphics();    
  $.ajax({
        url: 'rdf2json.php?url='+encodeURIComponent(url),
        dataType: 'json',
        success: function(data){
          $("#waiting").hide();    
          //Add nodes
          var graph = Viva.Graph.graph();
          $.each(data.nodes, function(i, item){
              graph.addNode(item.name, {id: item.name, color: ""});
          });
          //Add edges
          $.each(data.links, function(i, item){
              graph.addLink(item.source, item.target);
          });
          
          var layout = Viva.Graph.Layout.forceDirected(graph, {
              springLength : 100,
              springCoeff : 0.0008,
              dragCoeff : 0.009,
              gravity : -1.2,
              theta : 0.8
          });            
          graphics.node(function(node){
                     var ui = Viva.Graph.svg('g'),
                         svgText = Viva.Graph.svg('text').attr('y', '-4px').attr("class", "nodetext").text(node.id),
//                         circle = Viva.Graph.svg('circle').attr('stroke-width', '1px').attr("stroke", "black").attr("r", "10px").attr("fill", '#00a2e8');
                          circle = Viva.Graph.svg('rect').attr("class", "node").attr("width", "10px" ).attr("height", "10px" ).attr("fill", '#00a2e8');
                         ui.append(svgText);
                         ui.append(circle);
;
                         return ui;
                           //.attr('width', 64)
                           //.attr('height', 64)
                           //.link('http://www2.research.att.com/~yifanhu/GALLERY/GRAPHS/GIF_THUMBNAIL/Bai@bfwa62.gif');
                     }).placeNode(function(nodeUI, pos){
                       var nodeSize=10
                        nodeUI.attr('transform', 'translate(' + (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) + ')');
                     });
          var renderer = Viva.Graph.View.renderer(graph,
            {
              graphics: graphics,
              layout: layout,
              container: document.getElementById('chart'),
              renderLinks: true,
                        prerender  : true
            });
          /*graph.forEachNode(function(node){
          console.log(node.id, node.data);
          });*/
          renderer.run();
        }
    });
    
    
});
