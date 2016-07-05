
    
var width = window.innerWidth,
    height = window.innerHeight;
var currentNode = null;
var currentLink = null;
var index=0;
var timer=10;
var root_json="graph";
var path_json ="js/json/";
var pastJson=null;
var currentLevel = 0;
var force = force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(40)
    .on("tick",tick);
    
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>ID:</strong> <span style='color:red'>" + d.index + "</span>";
  })

var drag =force.drag();   
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .on("dblclick.zoom", null)
    .append('g');
  var drag = force.stop().drag()
.on("dragstart", function(d) {
    d3.event.sourceEvent.stopPropagation();
    });  
var loading;
load(); 
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
var levels = {level0: name};
svg.call(tip);
function loadGraph(){
    link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

   	current_path = "";
   	if (currentLevel != 0 )
   	{
	   	for (var i = 1; i <= currentLevel; i++) {
	   		current_path += levels[ ( i ) ] + "/";
	   		console.log("current_path: " + current_path);
	   	}
	}
	d3.json(path_json + current_path + root_json + ".json", function(error, graph) {
		if (error) throw error;
	       if(pastJson!= JSON.stringify(graph)){
	           //console.log(name);
	           //console.log("pastJson" + pastJson);
	           //console.log(JSON.stringify(graph));
	           svg.selectAll("*").remove();
	           //console.log("removeu");
	           pastJson=JSON.stringify(graph);
	           force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();
	  link = link.data(graph.links)
	    .enter().append("line")
        //.on("click",linkClick)
	      .attr("class", "link");
	    
	  node = node.data(graph.nodes)
	    .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", 12)
	      .attr("index", function(){index++;return index-1;})
	      .call(drag)
          .style("fill", "red")
	      .on("dblclick",dblclick)
	      //.on("click",click)
	      .on("mouseover",tip.show)
	      .on("mouseout",tip.hide);
	       index=0; 
           
    }
  
});
    
    setTimeout(function() {
  force.start();
  for (var i = force.nodes().length * force.nodes().length; i > 0; --i) force.tick();
  force.stop();
      for (i=0;i<force.nodes().length;i++) {
        force.nodes()[i].fixed = true;
        }

  loading.remove();
}, 10);
}
loadGraph();
var update=setInterval(updateData, timer*1000);
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
  
    // increment to know actual level
    currentLevel++;
    name =  "node"+d3.select(this).attr( "index" );
    levels[ ( currentLevel ) ] = name;
    console.log(levels);
    changeLevel(currentLevel);
    console.log("currentLevel: " + currentLevel);
}
   
/*
function click() {
    if(currentNode==null) {
        currentNode=d3.select(this);
    }
    if( (d3.rgb(currentNode.style("fill")).toString()) == "#000000") {
        color = "#ccc";
    }
    else {
        color = d3.rgb(currentNode.style("fill")).toString();
    }
    if(d3.select(this).attr("selected")==1){
        d3.select(this).style("fill", color);
        d3.select(this).attr("selected",0);
        console.log("Ja esta selecionado!");
        //d3.select(this).attr("r",12);
        document.getElementById("settings").style.visibility = "hidden"; 
    }else{
        d3.select(this).style("fill", "black");
        d3.select(this).attr("selected",1);
        document.getElementById("settings").style.visibility = "visible"; 
    }
    if(currentNode!=null && d3.select(this).attr("index")!=currentNode.attr("index") ){
        currentNode.attr("selected",0);
        //currentNode.attr("r",12);
        currentNode.style("fill", color);
    }
    currentNode = d3.select(this);
    //color = d3.rgb(currentNode.style("fill")).toString();
    switch(color){
        case "#cccccc":  
            document.getElementById("color").selectedIndex = 3;
        break;
        case "#ff0000":  
            document.getElementById("color").selectedIndex = 0;
        break;
        case "#0000ff":  
            document.getElementById("color").selectedIndex = 1;
        break;
        case "#ffff00":  
            document.getElementById("color").selectedIndex = 2;
        break;
        default:
            document.getElementById("color").selectedIndex = 3;
        break;
    }
    
}*/
function linkClick(){
    if(currentLink==null) currentLink=d3.select(this);
    if(d3.select(this).attr("selected")==1){
        d3.select(this).attr("selected",0);
        d3.select(this).style("stroke","#000");
    }else{
        d3.select(this).attr("selected",1);
        d3.select(this).style("stroke","red");
    }
    if(currentLink != null){
        if(d3.select(this).attr("x1")!=currentLink.attr("x1") || d3.select(this).attr("y1")!= currentLink.attr("y1")
        || d3.select(this).attr("x2")!=currentLink.attr("x2") || d3.select(this).attr("y2")!= currentLink.attr("y2") ){
            currentLink.attr("selected",0);
            currentLink.style("stroke","#000");
        }   
    }
    currentLink = d3.select(this);
    if(currentLink.attr("selected")==1){
        document.getElementById("settings").style.visibility = "visible";
    }else{
        document.getElementById("settings").style.visibility = "hidden";
    }
    
    size= currentLink.style("stroke-width");
    switch(size){
        case "1.5px":  
            document.getElementById("size").selectedIndex = 0;
        break;
        case "3px":  
            document.getElementById("size").selectedIndex = 1;
        break;
        case "4.5px":  
            document.getElementById("size").selectedIndex = 2;
        break;
        case "6px":  
            document.getElementById("size").selectedIndex = 3;
        break;
    }
}

function changeColor() {
    node = node.style("fill", (document.getElementById("color").value));
    /*if(currentNode.attr("selected")==1) {
        if(currentNode != null) {
            currentNode.style("fill",document.getElementById("color").value);
            
        }
    }*/
}

function changeSize() {
    link = link.style("stroke-width", document.getElementById("size").value);
    /*if(currentLink.attr("selected")==1) {
        if(currentLink!=null) currentLink.style("stroke-width", document.getElementById("size").value);  
    }   */
}

function createInterval(){
    if (document.getElementById("timer").value!=""){
        clearInterval(update);
       timer=document.getElementById("timer").value;
    update=setInterval(updateData, timer*1000); 
    }
    
}
function updateData(){
    
    loadGraph();
}
function changeLevel(n) {
    currentLevel = n;
    enableLevel(currentLevel);
    name = levels[ ( currentLevel ) ];
    svg.selectAll("*").remove();
    loadGraph();
    createInterval();
    // active clicked level
    document.getElementById( 'l' + currentLevel ).setAttribute( 'class', 'active' );
}

// function to enable navbar button for previous levals
function enableLevel(leval) {
  document.getElementById("levels").innerHTML = " ";
  for (i = 0; i < currentLevel; i++) {
      document.getElementById("levels").innerHTML += "<li id='l" + i + "' onclick='changeLevel(" + 
                                                      i + ");'><a href='#'>Level " + i + "</a></li>";
  }
  document.getElementById("levels").innerHTML += "<li class='active' id='l" + 
                                                  leval + "' onclick='changeLevel(" + leval + 
                                                  ");'><a href='#'>Level " + leval + "</a></li>";
}

function redraw() {
    svg.selectAll(".node").attr("r",12/d3.event.scale);
    svg.selectAll(".node").style("stroke-width",1.5/d3.event.scale+"px");
    svg.selectAll("line.link").style("stroke-width", 1.5/d3.event.scale+"px");
      svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
    }

