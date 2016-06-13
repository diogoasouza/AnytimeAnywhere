
    
var width = window.innerWidth,
    height = window.innerHeight;

var index=0;
var name="graph";
var force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(40)
    .on("tick",tick);
    
var drag = force.drag();
    
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var loading;
load(); 
console.log(loading);
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
    

function loadGraph(name){
   d3.json("js/json/"+name+".json", function(error, graph) {
  if (error) throw error;
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
       
  link = link.data(graph.links)
    .enter().append("line")
      .attr("class", "link");
  node = node.data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      .attr("index", function(){index++;return index-1;})
      .call(drag)
      .on("dblclick",dblclick)
      .on("click",click);
});
    setTimeout(function() {
  force.start();
        console.log(force.nodes());
  for (var i = force.nodes().length * force.nodes().length; i > 0; --i) force.tick();
  force.stop();
      for (i=0;i<force.nodes().length;i++) {
        force.nodes()[i].fixed = true;
        }

  loading.remove();
}, 10);
}
loadGraph(name);
function load(){
    loading = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…"); 
}
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}


function dblclick(){
    load();
    loadGraph("node"+d3.select(this).attr("index"));
    svg.selectAll("*").remove();
    loadGraph("node"+d3.select(this).attr("index"));
}
    
function click() {
    document.getElementById("settings").style.visibility = "visible";
}


