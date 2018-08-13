function processData() {
  let stations = [],
    totals = [],
    topTen = [],
    buildMatrix = [],
    matrix = [],
    data,
    names = [],
    newTotals = [],
    tmp,
    len,
    count;
  d3.json("../data/stations.json").then((response) => {
    stations = response;
  });
  d3.json("../data/simple-trips.json").then((response) => {
    count = 0;
    len = response.length;
    for (let i = 0; i < len; i++) {
      if (i === 0) {
        count++;
      }
      else if (i == len - 1) {
        totals.push([response[i - 1][0], count]);
        count = 0;
      } else if (response[i][0] === response[i - 1][0]) {
        count++;
      } else {
        totals.push([response[i - 1][0], count]);
        count = 0;
      }
    }
    totals = totals.sort((a, b) => {
      return a[1] - b[1];
    });
    totals = totals.slice(totals.length - 10).reverse();
    topTen = totals.map((total) => total[0]);
    response = response.filter((datum) => {
      if (topTen.indexOf(datum[0]) !== -1) {
        return datum;
      }
    });
    response = response.filter((datum) => {
      if (topTen.indexOf(datum[1]) !== -1) {
        return datum;
      }
    });
    for (i = 0, len = topTen.length; i < len; i++) {
      tmp = response.filter((datum) => {
        if (datum[0] == topTen[i]) {
          return datum;
        }
      });
      tmp.sort((a, b) => {
        return a[1] - b[1];
      });
      names.push(stations[topTen[i]].slice(0, stations[topTen[i]].indexOf(" -")));
      buildMatrix[i] = [stations[topTen[i]], tmp, [topTen[i]]];
    }
    for (i = 0; i < buildMatrix.length; i++) {
      count = 0;
      for (var j = 0, len = buildMatrix[i][1].length; j < len; j++) {
        if (j === 0) {
          count++;
        } else if (j == len - 1) {
          newTotals.push(count);
          count = 0;
        } else if (buildMatrix[i][1][j][1] === buildMatrix[i][1][j - 1][1]) {
          count++;
          if (i == 9) {
          }
        } else if (j == len - 1) {
          newTotals.push(count);
          count = 0;

        } else {
          newTotals.push(count);
          count = 0;
        }
        tmp = [];
        tmp[0] = newTotals[4];
        tmp[1] = newTotals[0];
        tmp[2] = newTotals[6];
        tmp[3] = newTotals[2];
        tmp[4] = newTotals[1];
        tmp[5] = newTotals[8];
        tmp[6] = newTotals[3];
        tmp[7] = newTotals[7];
        tmp[8] = newTotals[9];
        tmp[9] = newTotals[5];
        matrix[i] = tmp;

      }

      console.log(JSON.stringify(matrix),JSON.stringify(names))
    }
    drawChord(matrix, names)
  });
}
function drawChord() {
  const matrix = [[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311],[2689,508,1170,189,1007,187,745,248,263,2311]] 
  const names = ["South Station","TD Garden","Boston Public Library","Boylston St. at Arlington St","Back Bay / South End Statio","Charles Circle","Kenmore Sq / Comm Av","Beacon St / Mass Av","Lewis Wharf","Newbury St / Hereford S"]
  
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    outerRadius = Math.min(width, height) * 0.5 - 40,
    innerRadius = outerRadius - 30;

var formatValue = d3.formatPrefix(",.0", 1e3);

var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending);

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var ribbon = d3.ribbon()
    .radius(innerRadius);

var color = d3.scaleOrdinal()
    .domain(d3.range(4))
    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));

var group = g.append("g")
    .attr("class", "groups")
  .selectAll("g")
  .data(function(chords) { return chords.groups; })
  .enter().append("g");

group.append("path")
    .style("fill", function(d) { return color(d.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
    .attr("d", arc);

var groupTick = group.selectAll(".group-tick")
  .data(function(d) { return groupTicks(d, 1e3); })
  .enter().append("g")
    .attr("class", "group-tick")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

groupTick.append("line")
    .attr("x2", 6);

groupTick
  .filter(function(d) { return d.value % 5e3 === 0; })
  .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return formatValue(d.value); });

g.append("g")
    .attr("class", "ribbons")
  .selectAll("path")
  .data(function(chords) { return chords; })
  .enter().append("path")
    .attr("d", ribbon)
    .style("fill", function(d) { return color(d.target.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });

// Returns an array of tick angles and values for a given group and step.
function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
}


  g.append("svg:text")
    .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function (d) {
      var a = Math.sin(d.angle) * (outerRadius + 10),
        b = Math.cos(d.angle) * (outerRadius + 30);
      return "translate(" + a + "," + (-b) + ")";
    })
    .text(function (d) { return names[d.index]; });

  
}


processData();