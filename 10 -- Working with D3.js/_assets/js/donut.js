
let width = 1000,
  height = 1000,
  radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal()
  .domain(d3.range(13))
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
    "#073690",
    "#05299F",
    "#021BAF",
    "#000EBF"
  ]);

let arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 200);

let pie = d3.pie()
  .value((d) => {
    return d.numbers;
  });

let svg = d3.select("#target").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("data.csv").then((data) => {
  let g = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => { 
      return color(d.data.title); 
    })
    .filter((d) => {
      return d.endAngle - d.startAngle < .2;
    })

  svg.selectAll(".arc")
    .data(pie(data)).enter()
    .append("g")
    .attr("class", "text")
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", function (d) {
      if (d.startAngle > 6.0 && d.startAngle < 6.1) {
        return "-.6em"
      } else if (d.startAngle > 6.1) {
        return "-1.5em"
      }
    })
    .text(function (d) { return d.data.title; })
    .attr("text-anchor", "middle")
    .style("fill", "#fff")
    .filter(function (d) {
      return d.endAngle - d.startAngle < .2;
    })
    .attr("class", "small-slice");

});