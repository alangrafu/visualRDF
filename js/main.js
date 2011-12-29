
var w = document.getElementById("chart").offsetWidth,
    h = 600

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var files = d3.select("body").append("div").style("width", 100).style("height", 100).style("border-style", "solid").style("border-width", "1px").style("float", "left");

var preds=true;
var nodes = [];
var links = [];
var linkedArrowhead = [];
var force;

function mergeGraphs(newNodes, newLinks){
  console.log(links);
  for(i in newLinks){
  	sIdx = newLinks[i].source;
  	tIdx = newLinks[i].target;
  	
  	if(nodes.indexOf(newNodes[sIdx]) == -1){
  	  console.log("Adding "+newNodes[sIdx].uri+" to nodes")
  	  nodes.push(newNodes[sIdx]);
  	}
  	newLinks[i].source = nodes.indexOf(newNodes[sIdx]);
  	
  	if(nodes.indexOf(newNodes[tIdx]) == -1){
  	  console.log("Adding "+newNodes[tIdx].uri+" to nodes")
  	  nodes.push(newNodes[tIdx]);
  	}
  	newLinks[i].target = nodes.indexOf(newNodes[tIdx]);
	links.push(newLinks[i]);
  }
  console.log(links);

}

    function init(json){
    force = self.force = d3.layout.force();
    mergeGraphs(json.nodes, json.links);
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
      
  
  linkArrowhead = link.append("svg:polygon")
  .attr("class", "arrowhead")
  .attr("transform",function(d) {
  	  angle = Math.atan2(d.target.y-d.source.y, d.target.x-d.source.x);
  	  return "rotate("+angle+", "+d.target.x+", "+d.target.y+")";
  })
  .attr("points", function(d) {
  	  //angle = (d.y2-d.y1)/(d.x2-d.x1);
  	  return [[d.target.x,d.target.y].join(","),
  	  	[d.target.x-3,d.target.y+26].join(","),
  	  [d.target.x+3,d.target.y+26].join(",")].join(" ");
  });
      
      var node = vis.selectAll("g.node")
      .data(nodes)
      .enter().append("svg:g")
      .attr("class", "node")
      .attr("dx", "80px")
      .attr("dy", "80px")
      .call(force.drag);
      
      node.filter(function(d){return d.type == "bnode" || d.type == "uri"}).append("svg:circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("x", "-8px")
      .attr("y", "-8px")
      .attr("width", "16px")
      .attr("height", "16px")
      .style("fill", "#CFEFCF")
      .style("stroke", "#000");
      


      node.filter(function(d){return d.type == "literal"}).append("svg:rect")
      .attr("class", "node")
      .attr("x", "-4px")
      .attr("y", "-8px")
      .attr("width", "60px")
      .attr("height", "16px")
      .style("fill", "#CFEFCF")
      .style("stroke", "#000");
      
      node.filter(function(d){return d.type == "bnode" || d.type == "uri"}).append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
      
      
      node.filter(function(d){return d.type == "literal"}).append("svg:text")
      .attr("class", "literal")
      .attr("dx", 0)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
      
      arr1 = d3.selectAll("text.literal");
      arr = arr1[0];
      for(var i=0; i<arr.length; i++){
      	x = arr[i].previousSibling;
      	d3.select(x).attr("width", arr[i].clientWidth+8);
      }
      
      
      
      force.on("tick", function() {
      	  link.selectAll("line.link").attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
          link.selectAll("text.link").attr("x", function(d) { return (d.source.x+d.target.x)/2; })
          .attr("y", function(d) { return (d.source.y+d.target.y)/2; });
          
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; 
          });      
          
            	  linkArrowhead.attr("points", function(d) {
  	  	  return [[d.target.x,d.target.y+10].join(","),
  	  	  	[d.target.x-3,d.target.y+16].join(","),
  	  	  [d.target.x+3,d.target.y+16].join(",")].join(" ");
  	  })
  	  .attr("transform",function(d) {
  	  	  angle = Math.atan2(d.target.y-d.source.y, d.target.x-d.source.x)*180/Math.PI + 90;
  	  	  return "rotate("+angle+", "+d.target.x+", "+d.target.y+")";
  	  });
      });
      
      node.filter(function(d){return d.type == "uri"}).on('click', function(d){
      	  restart(d.uri);      	  
      });
}

d3.select("#properties").on('click', function(){
	if(preds){
	  d3.selectAll("text.link").style("display", "none")	;
	  preds = false;
	}else{
	  d3.selectAll("text.link").style("display", "inline")	;
	  preds = true;
	}	  
});

function restart(myUrl){
  d3.json('rdf2json.php?url='+encodeURIComponent(myUrl), function(json){
  	  d3.select("#waiting").style("display", "none");
  	  init(json);
  });  
}
restart(url);
