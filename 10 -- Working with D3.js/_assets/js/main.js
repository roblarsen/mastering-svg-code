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
function drawChord(matrix, names) {
  //based on http://bl.ocks.org/mbostock/4062006 and other D3 based examples
  var chord = d3.chord()
    .padding(.05)
    .sortSubgroups(d3.descending)
    .matrix(matrix);
  var width = 900,
    height = 500,
    innerRadius = Math.min(width, height) * .35,
    outerRadius = innerRadius * 1.1;

  var fill = d3.scale.ordinal()
    .domain(d3.range(4))
    .range(["#336699", "#99ccff", "#6699cc", "#0066cc"]);

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.append("g").selectAll("path")
    .data(chord.groups)
    .enter().append("path")
    .style("fill", function (d) { return fill(d.index); })
    .style("stroke", function (d) { return fill(d.index); })
    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));



  var ticks = svg.append("g").selectAll("g")
    .data(chord.groups)
    .enter().append("g").selectAll("g")
    .data(groupTicks)
    .enter().append("g")
    .attr("transform", function (d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        + "translate(" + outerRadius + ",0)";
    });

  ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .style("stroke", "#000");

  ticks.append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
    .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
    .text(function (d) { return d.label; });

  svg.append("g")
    .attr("class", "chord")
    .selectAll("path")
    .data(chord.chords)
    .enter().append("path")
    .attr("d", d3.svg.chord().radius(innerRadius))
    .style("fill", function (d) { return fill(d.target.index); })
    .style("opacity", 1);
  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var g = svg.selectAll("g.group")
    .data(chord.groups)
    .enter().append("svg:g")
    .attr("class", "group")
    .on("mouseover", fade(.02))
    .on("mouseout", fade(.80));

  g.append("svg:path")
    .style("stroke", function (d) { return fill(d.index); })
    .style("fill", function (d) { return fill(d.index); })
    .attr("d", arc);
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

  // Returns an array of tick angles and labels, given a group.
  function groupTicks(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1000).map(function (v, i) {
      return {
        angle: v * k + d.startAngle,
        label: i % 5 ? null : v / 1000 + "k"
      };
    });
  }

  // Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return function (g, i) {
      svg.selectAll(".chord path")
        .filter(function (d) { return d.source.index != i && d.target.index != i; })
        .transition()
        .style("opacity", opacity);
    };
  }

}


processData();