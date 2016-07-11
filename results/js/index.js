timer =10;
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

// load the data
function loadData(){
    
    
    d3.json("js/json/data.json", function(error, data) {
        if(pastJson!= JSON.stringify(data)){
        pastJson=JSON.stringify(data);
        data.forEach(function(d) {
        d.Letter = d.Letter;
        d.shortestpath = +d.shortestpath;
    });
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
/*
.attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("income per capita, inflation-adjusted (dollars)");
*/

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