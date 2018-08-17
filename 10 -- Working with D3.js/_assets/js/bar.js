
let width = 960,
  height = 800,
  chartHeight = 600,
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 55
  }

let svg = d3.select("#target").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
let x = d3.scaleBand()
  .range([10, (width - margin.left - margin.right)])
  .paddingInner(0.1);

let y = d3.scaleLinear().range([chartHeight, 0]);
let xAxis = d3.axisBottom()
  .scale(x)
let yAxis = d3.axisLeft()
  .scale(y)
  .ticks(5);
let color = d3.scaleOrdinal()
  .domain(d3.range(10))
  .range([
    "#1fb003",
    "#1CA212",
    "#199522",
    "#178732",
    "#147A41",
    "#126C51",
    "#0F5F61",
    "#0C5170",
    "#0A4480",
    "#073690"
  ]);

d3.json("data/top-ten.json").then((data) => {
  x.domain(data.map(function (d) { return d.title; }));
  y.domain([0, d3.max(data, function (d) { return d.price; })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("dx", -10)
    .attr("dy", -5)

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .style("text-anchor", "end")

  svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .style("fill", (d) => {
      return color(d.price);
    })
    .attr("x", function (d) { return x(d.title); })
    .attr("width", () => { return x.bandwidth() })
    .attr("y", function (d) { return y(d.price); })
    .attr("height", function (d) { return chartHeight - y(d.price); });

});