var timer =10,
    array=[],
    sp =[],
    maximumShortestPath =20,  // default
    shortestPaths=[],
    update=setInterval(updateData, timer*1000),
    pastJson=null,
    sizeOfAxis=10,
    pastData=null,

// set the dimensions of the canvas
    margin = {top: 40, right: 20, bottom: 60, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
    x = d3.scale.ordinal().rangeRoundBands([0, width], .05),

    y = d3.scale.linear().range([height, 0]),

// define the axis
    xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom"),

    yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10),

    tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Number of Nodes:</strong> <span style='color:red'>" + d.shortestpath + "</span>";
  }),

// add the SVG element
    svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('class', 'graphic-bar')
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

document.getElementById("settings").style.visibility = "visible";

svg.call(tip);
for(var i=0;i<sizeOfAxis;i++){
    shortestPaths[i]=0;
}
/* Essa funcao eh a que normaliza os valores e coloca num objeto chamado shortestPaths
    ele tem varias propriedades pra separar as ranges
    */

function abreviation(number){
    var range=null;
    switch(true){
                case (number)>=1000000000:
                    range=""+(number/1000000000).toFixed(1)+"B";
                    break;
                case (number)>=1000000:
                    range=""+(number/1000000).toFixed(1)+"M";
                    break;
                case (number)>=1000:
                    range=""+(number/1000).toFixed(1)+"K";
                    break; 
                default:
                     range = "" + Math.round(number);
            }
    return range;
}
function normalize(){
    array=[];
    for(var i=0;i<sizeOfAxis;i++){
    array[i]={shortestpath:0, letter : " " +abreviation((maximumShortestPath/10)*(i)) +" - "+ abreviation((maximumShortestPath/10)*(i+1)) + "" };
    }
var max = Math.max.apply(Math, sp); // pega o maior elemento
var scale = d3.scale.linear().domain([0, max]).range([0, maximumShortestPath]); // cria a scale pra normalizar
for ( var i in sp ){
    switch (true) { // ve em qual range o shortest path ta e adiciona um nela
    case scale(sp[i])<Math.round(maximumShortestPath/10):
            array[0].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *2 :
            array[1].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *3:
            array[2].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *4:
            array[3].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *5:
            array[4].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *6:
            array[5].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *7:
            array[6].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *8:
            array[7].shortestpath++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *9:
            array[8].shortestpath++;
        break;
    case scale(sp[i])<=(maximumShortestPath/10) *10:
            array[9].shortestpath++;
        break;
}
}  sp=[];
}

// load the data
function loadData(){
	console.log("Max Shortest Path: " + maximumShortestPath);
  
  // adding the values that are defalut in the text field
  document.getElementById('maxShortP').value = maximumShortestPath;
  document.getElementById('timer').value = timer;
//eu sei que a metrica do grafico nao ta sendo number of nodes, nao consegui pensar numa forma de fazer ser aquilo
    d3.csv("js/json/data.txt", function(error, data) {
        if (pastData!=data.toString()){
            svg.selectAll("*").remove();
            console.log(pastData);
            console.log(data);
            pastData=data.toString();
            linhas = data.length-1; // numero de linhas
    data.splice(0,1); // tira o primeiro elemento do array, o inutil
    for(var i=0;i<data.length;i++){ // separa a linha em varios arrays diferentes, ai vira um array de array
        array[i]=data[i].line.split(" ");
    }
    for(var j=0;j<array.length;j++){ // percorre o array de array pegando todos shortest paths e bota no array SP
     for(i=0;i<array[j].length;i++){
        sp.push(array[j][i]);
    }   
    }
    normalize();
  // scale the range of the data
  x.domain(array.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(array, function(d) { return Math.round(d.shortestpath / 10) * 10; })]);

  // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

      .append("text")
      .attr("x", 140)
      .attr("y", 40)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Shortest Path Distance");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -290)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Nodes");


  // Add bar chart
  svg.selectAll("bar")
      .data(array)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {return x(d.letter); })
      .attr("width", x.rangeBand())
      //.attr("x", 20)
      .attr("y", function(d) { return y(d.shortestpath); })
      .attr("height", function(d) { return height - y(d.shortestpath); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
        }
});    
    
    
}
loadData();
/*
function createInterval(){
    //clearInterval(update);
    setInterval(updateData, 10000);  
}*/

function createInterval(){
    if (document.getElementById("timer").value!=""){
        clearInterval(update);
       timer=document.getElementById("timer").value;
    update=setInterval(updateData, timer*1000); 
    }
    
}

function updateData(){
    loadData();
}

createInterval()

function maxShortestPath() {
	if (document.getElementById("maxShortP").value!=""){
       maximumShortestPath=document.getElementById("maxShortP").value;
       //console.log("Max Shortest Path: " + maximumShortestPath);
        pastData=null;
       loadData();
    }
}