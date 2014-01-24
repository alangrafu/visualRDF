
var w = document.getElementById("chart").offsetWidth-2,
h = document.getElementById("chart").offsetHeight;

var svg = d3.select("#chart").append("svg:svg")
.attr("width", w)
.attr("height", h)
.attr("pointer-events", "all");
vis = svg
.append('svg:g')
.call(d3.behavior.zoom().on("zoom", redraw))
.append('svg:g');

vis.append('svg:rect')
.attr('width', w)
.attr('height', h)
.attr('fill', 'white');


var preds=false;
var types=true;
var nodes = [];
var links = [];
var literals = [];
var linkedArrowhead = [];
var force;
var uniquePredicates = {};
function redraw() {
	vis.attr("transform",
		"translate(" + d3.event.translate + ")"
		+ " scale(" + d3.event.scale + ")");
}


function mergeGraphs(newNodes, newLinks){
	for(i in newLinks){
		sIdx = newLinks[i].source;
		tIdx = newLinks[i].target;

		if(nodes.indexOf(newNodes[sIdx]) == -1){
			nodes.push(newNodes[sIdx]);
		}
		newLinks[i].source = nodes.indexOf(newNodes[sIdx]);

		if(nodes.indexOf(newNodes[tIdx]) == -1){
			nodes.push(newNodes[tIdx]);
		}
		newLinks[i].target = nodes.indexOf(newNodes[tIdx]);
		links.push(newLinks[i]);
	}

}

function createPredicateFilters(up){
	//d3.select("#preds").append("div").attr("class", "filter")
	//                     .html("<input type='checkbox' id='all' class='all'/><label for='all'>All Predicates</label>");
	for(i in up){
		d3.select("#preds").append("div").attr("class", "filter")
		.html("<input type='checkbox' id='"+i+"' class='pred-filter'/><label for='"+i+"'>"+i+"</label>");
	}
	updateFilters();
}
function init(json){
	literals = json.literals;
	for(i in json.links){
		uniquePredicates[json.links[i].name] = 1;
	}
	createPredicateFilters(uniquePredicates);
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
	.append("svg:g").attr("class", "link").attr("class", function(d){return d.name})
	.call(force.drag);
	link.append("svg:line")
	.attr("class", "link")
	.attr("stroke", "gray")
	.attr("x1", function(d){return d.x1})
	.attr("y1", function(d){return d.y1})
	.attr("x2", function(d){return d.x1})
	.attr("y2", function(d){return d.y2});

	link.append("svg:text")
	.attr("class", "link")
	.attr("x", function(d) { return d.source.x; })
	.attr("y", function(d) { return d.source.y; })
	.text(function(d){return d.name;}).style("display", "none");


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

	node.filter(function(d){return d.type == "uri"})/*.append("svg:a")
	.attr("xlink:href", function(d){return "./?url="+d.uri} ).attr("target", "_new")*/
	.append("svg:circle")
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
	.attr("dy", ".35em").attr("xlink:href", "http://graves.cl").attr("target", "_new")
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
		d3.select(x).attr("width", arr[i].getBBox().width+8);
	}


	var ticks = 0;
	force.on("tick", function() {
		ticks++;
		if (ticks > 300) {
			force.stop();
			force.charge(0)
			.linkStrength(0)
			.linkDistance(0)
			.gravity(0);
			force.start();
		}
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
		d3.selectAll('circle').on('mouseenter', function(d){
			var currentLiterals = literals[d.name];
			var tablebody = $("#literalbody");
			tablebody.empty();
			$("#literalsubject").html(d.name);
			if (currentLiterals != undefined){
				d3.select("#literaltable").style("display", "block");
				d3.select("#literalmsg").html("")
				$.each(currentLiterals, function(i, item){
					language = (item['l'] == "")?"":" <strong>("+item['l']+")</strong>";
					datatype = (item['d'] == "")?"":"^^<strong>"+item['d']+"</strong>";
					td = "<tr><td>"+item['p']+"</td><td>"+item['o']+datatype+language+"</td></tr>"
					tablebody.append($(td))
				})
			}else{
				d3.select("#literaltable").style("display", "none");
				d3.select("#literalmsg").html("No literals related to this URI")
			}
			var x = d3.event.pageX+"px",
			y = d3.event.pageY+"px";
			var l = d3.select("#literals");
			l.style("top", y).style("left", x).style("display", "block");
		}).on('mouseout', function(d){
			var l = d3.select("#literals");
			l.style("display", "none");

		});

	});

			/*node.filter(function(d){return d.type == "uri"}).on('click', function(d){
					restart(d.uri);
				});*/
}


function restart(myUrl){
	d3.json('rdf2json.php?url='+encodeURIComponent(myUrl), function(json){
		d3.select("#waiting").style("display", "none");
		init(json);
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
d3.select("#hidePredicates").on('click', function(){
	var menu = d3.select("#preds");
	if(menu.style("display") == "none"){
		menu.style("display", "inline")	;
	}else{
		menu.style("display",  "none")
	}
});
function updateFilters(){


	d3.selectAll(".pred-filter").on('change', function(){
		predType = d3.select(this).attr("id").replace(":", "\\:");
		var l = d3.selectAll("g."+predType);
		if(uniquePredicates[predType] == 1){
			d3.selectAll("g."+predType).style("display", "inline")	;
			uniquePredicates[predType] = 0;
		}else{
			d3.selectAll("g."+predType).style("display", "none")	;
			uniquePredicates[predType] = 1;
		}
	});
}


restart(url);

