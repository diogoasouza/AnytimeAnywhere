var timer =10, // refresh timer
    array=[],
    sp =[],  // array for shortest path
    max =20,  // default maximum nshortest path
    shortestPaths=[],  // array for shortest path
    update=setInterval(updateData, timer*1000), // interval to update
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
  // label for each bar on the graphic
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
/* Normalize the values and add in a object called "shortestPaths"
    It has property to separate the ranges
*/
for(var i=0;i<sizeOfAxis;i++){
    shortestPaths[i]=0;
}

/* 
  Function to abreviate numbers that are too big. Adding "B" for billions,
  "M" for millions and "K" for thousands
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

/* 
  Functions to normalize the graphic values and using range for values
*/
function normalize(){
    array=[];
var max = Math.max.apply(Math, sp); // pega o maior elemento
//max=max;
    for(var i=0;i<sizeOfAxis;i++){
    array[i]={shortestpath:0, letter : " " +abreviation((max/10)*(i)) +" - "+ abreviation((max/10)*(i+1)) + "" };
    }

// scale to normalize
var scale = d3.scale.linear().domain([0, max]).range([0, max]);
for ( var i in sp ){
  // add 1 where the shortest path is
    switch (true) { 
    case scale(sp[i])<Math.round(max/10):
            array[0].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *2 :
            array[1].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *3:
            array[2].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *4:
            array[3].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *5:
            array[4].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *6:
            array[5].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *7:
            array[6].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *8:
            array[7].shortestpath++;
        break;
    case scale(sp[i])<(max/10) *9:
            array[8].shortestpath++;
        break;
    case scale(sp[i])<=(max/10) *10:
            array[9].shortestpath++;
        break;
}
}  sp=[];
}

// load the data
function loadData(){
	console.log("Max Shortest Path: " + max);
  
  // adding the values that are defalut in the text field
  document.getElementById('timer').value = timer;
    d3.csv(("js/json/data.txt?" + Math.floor(Math.random() * 100000)), function(error, data) {
        if (pastData!=data.toString()){
          console.log(data.toString());
            svg.selectAll("*").remove();
            console.log(pastData);
            console.log(data);
            pastData=data.toString();
            linhas = data.length-1; // number of lines
    data.splice(0,1); // eliminates the first element into array, that is line number
    // separate the line in different arrays, using an array of arrays
    for(var i=0;i<data.length;i++){
        array[i]=data[i].line.split(" ");
    }
    // go through the array getting the shortest path and add it to the "SP" array
    for(var j=0;j<array.length;j++){
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
      .attr("y", function(d) { return y(d.shortestpath); })
      .attr("height", function(d) { return height - y(d.shortestpath); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
        }
});    
    
    
}
loadData();
// Function to create the interval
function createInterval(){
    if (document.getElementById("timer").value!=""){
        clearInterval(update);
       timer=document.getElementById("timer").value;
    update=setInterval(updateData, timer*1000); 
    }
    
}

// Function to update the data calling the loadData function
function updateData(){
    loadData();
}

createInterval();