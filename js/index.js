var width = window.innerWidth,
    height = window.innerHeight;
    currentNode = null,
    currentLink = null,
    index=0,
    scale = 1,
    aux=0,
    timer=10,
    animationTime=5000,
    root_json="graph",
    path_json ="js/json/",
    pastJson=null,
    pathRemote = null,
    lineWidth=1.5,
    currentLevel = 0,
    nNodes = 0,
    maximumNodeSize=50,
    force = force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(40)
    .on("tick",tick);
    update=setInterval(updateData, timer*1000),
    tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>ID:</strong> <span style='color:red'>" + d.index + 
            "</span><br/>Number of Nodes:<span style='color:red'id='" + d.index +"'> " + 
            svg.select("#node"+d.index).attr("numberOfNodes")+ "</span>";
  }),
    drag =force.drag(), 
    svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .on("dblclick.zoom", null)
    .append('g'),
      drag = force.stop().drag()
.on("dragstart", function(d) {
    d3.event.sourceEvent.stopPropagation();
    }),  
    loading=null,

    link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    levels = {level0: name};
load(); 
svg.call(tip);
console.log(document.getElementsByTagName("g"));
function loadGraph(path){
     // adding the values that are defalut in the text field
   //document.getElementById('maxShortP').value = maximumShortestPath;
    document.getElementById('timer').value = timer;
    
   	current_path = "";
   	if (currentLevel != 0 )
   	{
	   	for (var i = 1; i <= currentLevel; i++) {
	   		current_path += levels[ ( i ) ] + "/";
	   	}
	}
    pathRemote = path;
    console.log(path + path_json + current_path + root_json + ".json");
    // using math floor to avoid caching
	d3.json((path + path_json + current_path + root_json + ".json?" + Math.floor(Math.random() * 1000)), function(error, graph) {
		if (error) throw error;
	       if(pastJson!= JSON.stringify(graph)){
               console.log("different jsons");
	           svg.selectAll("*").remove();
               link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
	           pastJson=JSON.stringify(graph);
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
	      .attr("id", function(){index++;return "node"+(index-1);})
	      .call(drag)
          .style("fill", "red")
	      .on("dblclick",dblclick)
	      .on("mouseover",tip.show)
	      .on("mouseout",tip.hide);
	       index=0; 
        abc();   
    }

});
    force.start();
    setTimeout(function() {
  
//  for (var i = force.nodes().length * force.nodes().length; i > 0; --i) force.tick();
  force.stop();
      for (i=0;i<force.nodes().length;i++) {
        force.nodes()[i].fixed = true;
        }
  loading.remove();
}, animationTime);
    
}


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
    name =  d3.select(this).attr( "id" );
    levels[ ( currentLevel ) ] = name;
    changeLevel(currentLevel);
}




function changeColor() {
    node = node.style("fill", (document.getElementById("color").value));
}

function changeSize() {
    lineWidth=document.getElementById("size").value;
    link.style("stroke-width", lineWidth/scale);
}

function createInterval(){
    if (document.getElementById("timer").value!=""){
        clearInterval(update);
       timer=document.getElementById("timer").value;
    update=setInterval(updateData, timer*1000); 
    }
    
}
function updateData(){
    console.log("Inside updateData");
    loadGraph(pathRemote);
}
function changeLevel(n) {
    console.log("Inside changeLevel");
    tip.hide;
    console.log(tip);
    currentLevel = n;
    enableLevel(currentLevel);
    name = levels[ ( currentLevel ) ];
    svg.selectAll("*").remove();
    loadGraph(pathRemote);
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
    scale = d3.event.scale;
    dynamicSize();
    svg.selectAll(".node").style("stroke-width",1.5/scale+"px");
    svg.selectAll("line.link").style("stroke-width", lineWidth/scale+"px");
      svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
}

function abc(){
    svg.selectAll(".node").attr("a", function(d){
        var node_over_path = "node" + d.index + "/";
        d3.json(pathRemote+path_json + current_path + node_over_path + root_json + ".json", function(error, graph) {           
        if (error) {
            nNodes = 0;
            svg.select("#node"+d.index).attr("originalSize", 12);
            svg.select("#node"+d.index).attr("numberOfNodes", nNodes);
        }
           
        else {
            nNodes = graph.nodes.length;
            svg.select("#node"+d.index).attr("numberOfNodes", nNodes);
            if(nNodes+12<=maximumNodeSize){
                 svg.select("#node"+d.index).attr("r", nNodes+12);
                svg.select("#node"+d.index).attr("originalSize", nNodes+12);
            }else{
                 svg.select("#node"+d.index).attr("r", maximumNodeSize);
                 svg.select("#node"+d.index).attr("originalSize", maximumNodeSize);
            }
        
        }
    });   
    });

   
}

function dynamicSize(){
  if (document.getElementById('dynsize').checked) 
  {
      svg.selectAll(".node").attr("r",function(d){return svg.select("#node"+d.index).attr("originalSize")/scale});
  }
  else{
      svg.selectAll(".node").attr("r",12/scale);
  }
}

function goToGraph() {
  console.log("inside goToGraph");
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("menuRight").style.pointerEvents = "auto";
  document.getElementById("levels").style.pointerEvents = "auto";
  var radios = document.getElementsByName('files');
  document.getElementById("modal").style.display = "none";

  console.log("Text field: " + document.getElementById("fname").value);
  loadGraph(document.getElementById("fname").value);
}
/*
function maxSizeNodes() {
  //document.getElementById("maxSize").value;
  //console.log("Scale inside maxSizeNodes: ");
}
*/
/*
function getBiggestNode(){
   return new Promise(function(resolve, reject) {
        svg.selectAll(".node").attr("a", function(d){
        var node_over_path = "node" + d.index + "/";
        d3.json(pathRemote+path_json + current_path + node_over_path + root_json + ".json", function(error, graph) {           
        if (error) {
            nNodes = 0;
        }
        else {
            if(graph.nodes.length>biggestNode){
                console.log("entrou no if e o biggestNode eh: "+biggestNode+" e o graph length eh: "+ graph.nodes.length);
                biggestNode=graph.nodes.length;
            } 
        }
    });   
    });
   });
        
    
     
}*/
/*
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
    lineWidth= currentLink.style("stroke-width");
    switch(lineWidth){
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
}*/