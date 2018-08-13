function drawChord() {
  const matrix = [
    [2689, 508, 1170, 189, 1007, 187, 745, 248, 263, 2311],
    [1064, 121, 830, 323, 2473, 393, 453, 312, 533, 599],
    [506, 296, 813, 530, 988, 540, 1936, 578, 747, 268],
    [706, 311, 1568, 526, 1273, 371, 618, 694, 481, 227],
    [178, 701, 277, 176, 663, 227, 379, 284, 330, 111],
    [550, 270, 548, 445, 196, 769, 868, 317, 1477, 195],
    [344, 141, 468, 955, 172, 346, 502, 388, 415, 97],
    [333, 207, 455, 545, 196, 1322, 618, 254, 659, 62],
    [655, 120, 301, 90, 2368, 108, 226, 99, 229, 875],
    [270, 221, 625, 436, 239, 278, 548, 1158, 320, 90]
  ];
  const names = [
    "South Station",
    "TD Garden",
    "Boston Public Library",
    "Boylston St. at Arlington St",
    "Back Bay / South End Station",
    "Charles Circle",
    "Kenmore Sq / Comm Av",
    "Beacon St / Mass Av",
    "Lewis Wharf",
    "Newbury St / Hereford S"
  ];

  let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    outerRadius = Math.min(width, height) * 0.5 - 40,
    innerRadius = outerRadius - 30;

  let formatValue = d3.formatPrefix(",.0", 1e3);

  let chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending);
  let arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  let ribbon = d3.ribbon()
    .radius(innerRadius);
  let color = d3.scaleOrdinal()
    .domain(d3.range(9))
    .range([
      "002244",
      "183858",
      "304F6D",
      "496582",
      "617C97",
      "7992AB",
      "92A9C0",
      "AABFD5",
      "C2D6EA",
      "DBEDFF"
    ]);
  let g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));
  let group = g.append("g")
    .attr("class", "groups")
    .selectAll("g")
    .data((chords) => chords.groups )
    .enter().append("g");

  group.append("path")
    .style("fill", (d)=> color(d.index))
    .style("stroke", (d)=> d3.rgb(color(d.index)).darker())
    .attr("d", arc)
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

  group.append("text")
    .each((d)=> d.angle = (d.startAngle + d.endAngle) / 2 )
    .attr("dy", ".35em")
    .attr("text-anchor", (d)=> {
      if (d.angle > Math.PI) {
        return "end";
      } else {
        return null;
      }
    })
    .attr("transform", (d)=> {
      var a = Math.sin(d.angle) * (outerRadius + 10),
        b = Math.cos(d.angle) * (outerRadius + 30);
      return "translate(" + a + "," + (-b) + ")";
    })
    .text((d)=> { return names[d.index]; });

  let groupTick = group.selectAll(".group-tick")
    .data((d)=> { return groupTicks(d, 1e3); })
    .enter().append("g")
    .attr("class", "group-tick")
    .attr("transform", (d)=> {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
    });

  groupTick.append("line")
    .attr("x2", 6);

  groupTick
    .filter((d)=> { return d.value % 5e3 === 0; })
    .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", (d)=> {
      if (d.angle > Math.PI) {
        return "rotate(180) translate(-16)";
      } else {
        return null;
      }
    })
    .style("text-anchor", (d)=> {
      if (d.angle > Math.PI) {
        return "end";
      } else {
        return null;
      }
    })
    .text((d)=> formatValue(d.value));

  g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data(function (chords) { return chords; })
    .enter().append("path")
    .attr("d", ribbon)
    .style("fill", (d)=> color(d.target.index))
    .style("stroke", (d)=> d3.rgb(color(d.index)).darker())


  // Returns an array of tick angles and values for a given group and step.
  function groupTicks(d, step) {
    let k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map((value)=> {
      return {
        value: value,
        angle: value * k + d.startAngle
      };
    });
  }
  function fade(opacity) {
    return function(g, i) {
      svg.selectAll(".ribbons path")
        .filter((d)=> {
          return d.source.index !== i && d.target.index !== i;
        })
        .transition()
        .style("opacity", opacity);
    };
  }
}

drawChord();