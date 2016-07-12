timer =10;
var array =[];
    var sp=[];
var shortestPaths={range1:0,range2:0,range3:0,range4:0,range5:0,range6:0,range7:0,range8:0,range9:0,range10:0};
var linhas =0;
var maximumShortestPath=20;
var update=setInterval(updateData, timer*1000);
var pastJson=null;
// set the dimensions of the canvas
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Number of Nodes:</strong> <span style='color:red'>" + d.shortestpath + "</span>";
  })

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('class', 'graphic-bar')
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("js/json/data.txt", function(error, data) {
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
})
/* Essa funcao eh a que normaliza os valores e coloca num objeto chamado shortestPaths
    ele tem varias propriedades pra separar as ranges
    */
function normalize(){
    console.log(sp);
var max = Math.max.apply(Math, sp); // pega o maior elemento
    console.log(max);
var scale = d3.scale.linear().domain([0, max]).range([0, maximumShortestPath]); // cria a scale pra normalizar
for ( var i in sp ){
    switch (true) { // ve em qual range o shortest path ta e adiciona um nela
    case scale(sp[i])<maximumShortestPath/10:
            shortestPaths.range1++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *2 :
            shortestPaths.range2++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *3:
            shortestPaths.range3++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *4:
            shortestPaths.range4++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *5:
            shortestPaths.range5++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *6:
            shortestPaths.range6++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *7:
            shortestPaths.range7++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *8:
            shortestPaths.range8++;
        break;
    case scale(sp[i])<(maximumShortestPath/10) *9:
            shortestPaths.range9++;
        break;
    case scale(sp[i])<=(maximumShortestPath/10) *10:
            shortestPaths.range10++;
        break;
}
    
}console.log(shortestPaths);
}


// load the data

function loadData(){
    d3.json("js/json/data.json", function(error, data) {
        if(pastJson!= JSON.stringify(data)){
        pastJson=JSON.stringify(data);
//        data.forEach(function(d) {
//        d.Letter = d.Letter;
//        d.shortestpath = +d.shortestpath;
//    });
  // scale the range of the data
  x.domain(data.map(function(d) { return d.Letter; }));
  y.domain([0, d3.max(data, function(d) { return d.shortestpath; })]);

  // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

      .append("text")
      .attr("x", 900)
      .attr("y", 30)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Shortest Path");


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Nodes");


  // Add bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.shortestpath); })
      .attr("height", function(d) { return height - y(d.shortestpath); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
        }
});    
    
    
}
loadData();
function createInterval(){
    clearInterval(update);
    update=setInterval(updateData, timer*1000);  
}
function updateData(){
    loadData();
}