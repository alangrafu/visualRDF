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
    
    //var graphics = webglSupported ? Viva.Graph.View.webglGraphics() : Viva.Graph.View.svgGraphics();
    var graphics = Viva.Graph.View.svgGraphics();    
    
    
    
    // Marker should be defined only once in <defs> child element of root <svg> element:
    
    
    $.ajax({
        url: 'rdf2json.php?url='+encodeURIComponent(url),
        dataType: 'json',
        success: function(data){
            var nodeSize=10;
                        var geom = Viva.Graph.geom(); 
    var createMarker = function(id) {
      return Viva.Graph.svg('marker')
      .attr('id', id)
      .attr('viewBox', "0 0 10 10")
      .attr('refX', "10")
      .attr('refY', "5")
      .attr('markerUnits', "strokeWidth")
      .attr('markerWidth', "10")
      .attr('markerHeight', "5")
      .attr('orient', "auto");
    },
    
    marker = createMarker('Triangle');
    marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

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
          
          var defs = $('#chart svg').append('defs');
          defs.append(marker);
          
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
            nodeUI.attr('transform', 'translate(' + (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) + ')');
          });
          
          
          graphics.link(function(link){
              // Notice the Triangle marker-end attribe:
              return Viva.Graph.svg('path')
              .attr('stroke', 'gray')
              .attr('marker-end', 'url(#Triangle)');
          }).placeLink(function(linkUI, fromPos, toPos) {
            // Here we should take care about 
            //  "Links should start/stop at node's bounding box, not at the node center."
            
            // For rectangular nodes Viva.Graph.geom() provides efficient way to find
            // an intersection point between segment and rectangle
            var toNodeSize = nodeSize,
            fromNodeSize = nodeSize;
            
            var from = geom.intersectRect(
              // rectangle:
              fromPos.x - fromNodeSize / 2, // left
              fromPos.y - fromNodeSize / 2, // top
              fromPos.x + fromNodeSize / 2, // right
              fromPos.y + fromNodeSize / 2, // bottom
              // segment:
              fromPos.x, fromPos.y, toPos.x, toPos.y) 
            || fromPos; // if no intersection found - return center of the node
            
            var to = geom.intersectRect(
              // rectangle:
              toPos.x - toNodeSize / 2, // left
              toPos.y - toNodeSize / 2, // top
              toPos.x + toNodeSize / 2, // right
              toPos.y + toNodeSize / 2, // bottom
              // segment:
              toPos.x, toPos.y, fromPos.x, fromPos.y) 
            || toPos; // if no intersection found - return center of the node
            
            var data = 'M' + from.x + ',' + from.y +
            'L' + to.x + ',' + to.y;
            
            linkUI.attr("d", data);
          });
          
          var renderer = Viva.Graph.View.renderer(graph,
            {
              graphics: graphics,
              layout: layout,
              container: document.getElementById('chart'),
              prerender  : true
            });
          /*graph.forEachNode(function(node){
          console.log(node.id, node.data);
          });*/
          renderer.run();
        }
    });
    
    
});
