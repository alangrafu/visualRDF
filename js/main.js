
var w = document.getElementById("chart").offsetWidth,
    h = 600

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var files = d3.select("body").append("div").style("width", 100).style("height", 100).style("border-style", "solid").style("border-width", "1px").style("float", "left");


var nodes = [];
var links = [];
var force;

    function init(json){
    force = self.force = d3.layout.force();
      nodes = json.nodes;
      links = json.links;
      force.nodes(nodes)
      .links(links)
      .gravity(0.2)
      .distance(2000)
      .charge(-2000)
      .linkDistance(100)
      .size([w, h])
      .start();
      
      var link = vis.selectAll("g.link")
      .data(links)
      .enter()
      .append("svg:g").attr("class", "link")
      .call(force.drag);
      link.append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d){return d.x1})
      .attr("y1", function(d){return d.y1})
      .attr("x2", function(d){return d.x1})
      .attr("y2", function(d){return d.y2});
      
      link.append("svg:text")
      .attr("class", "link")
      .attr("x", function(d) { return d.source.x; })
      .attr("y", function(d) { return d.source.y; })
      .text(function(d){return d.name;});
      
      //Adding circles to represent direction
      link.append("svg:circle")
      .attr("class", "link")
      .attr("cx", function(d) { return d.target.x; })
      .attr("cy", function(d) { return d.target.y; })
      .attr("r", 2).style("fill", "#000").style("stroke", "#000")
      .text(function(d){return d.name;});
      

      var node = vis.selectAll("g.node")
      .data(nodes)
      .enter().append("svg:g")
      .attr("class", "node")
      .attr("dx", "80px")
      .attr("dy", "80px")
      .call(force.drag);
      
      node.append("svg:circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("x", "-8px")
      .attr("y", "-8px")
      .attr("width", "16px")
      .attr("height", "16px")
      .style("fill", "#CFEFCF")
      .style("stroke", "#000");
      
     
      
      node.append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
      
      force.on("tick", function() {
      	  link.selectAll("line.link").attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
          link.selectAll("text.link").attr("x", function(d) { return (d.source.x+d.target.x)/2; })
          .attr("y", function(d) { return (d.source.y+d.target.y)/2; });
          link.selectAll("circle.link").attr("cx", function(d) { return (0.1*d.source.x+0.9*d.target.x); })
          .attr("cy", function(d) { return (0.1*d.source.y+0.9*d.target.y); });
          
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; 
          });                    
      });
}


function restart(){
  d3.json('rdf2json.php?url='+encodeURIComponent(url), function(json){
  	  d3.select("#waiting").style("display", "none");
  	  init(json);
  });  
}
restart();
