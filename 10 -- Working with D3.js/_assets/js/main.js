;(function(window, $){
    "use strict";    
 
    // Check to see if our global is available as a member of window; if it is, our namespace root exists; if not, we'll create it.
    var react = window.react = (typeof window.react !== "undefined") ? window.react : {};
    (react.dataviz = function(){
        return{
            util : {
              support: function( tech ){
              $.get("../data/"+tech+".json",function( data ){
                  var ul = "<ul>",
                    childUL;
                  for (var label in data.stats ) {
                    ul += "<li class=" + label +"><b>"+label+"</b>";
                    childUL = "<ul>";
                    var keys = Object.keys(data.stats[label]).sort(function(a,b){ 
                      return parseFloat(a) - parseFloat(b); 
                    });
                    for (var i = 0, len = keys.length; i < len; i++) {
                      childUL += "<li class='"+data.stats[label][keys[i]]+"'>"+keys[i]+"</li>";
                    }
                    childUL +="</ul>";
                    ul += childUL;
                    ul +="</li>";
                  }
                  ul +="</ul>";
                  $(".support."+tech+"").html(ul)
                });
              }
            },
            d3 : {
              init: function(){
                
                var stations,
                    totals = [],
                    topTen = [],
                    data, 
                    buildmatrix = [],
                    matrix = [],
                    names;
                $.get("../data/stations.json", function( data){
                  stations = data;
                });
                $.get("../data/simple-trips.json", function(data){
                  var count = 0,
                  len = data.length;
                /*
                use this!
                  var indices = [];
                  var idx = array.indexOf(element);
                  while (idx != -1) {
                      indices.push(idx);
                      idx = array.indexOf(element, idx + 1);
                  }
                 */
                for (var i = 0; i < len; i++){
                  if (i === 0){
                    count++;    
                  } 
                  else if (i == len-1) {
                    totals.push([data[i-1][0], count]);
                    count = 0;  
                  } else if ( data[i][0] === data[i-1][0]) {
                    count++;
                  }
                  else {
                    totals.push([data[i-1][0], count]);
                    count = 0;  
                  }  
                }  
                totals = totals.sort(function( a, b ){
                  return a[1] - b[1];  
                })
                totals = totals.slice( totals.length - 10).reverse();
                topTen = totals.map(function(element){return element[0]})
               data = data.filter(function(element){  if (topTen.indexOf(element[0]) !== -1){ return element }});
               data = data.filter(function(element){  if (topTen.indexOf(element[1]) !== -1){ return element }});
               var tmp;
               names = [];
               for (i = 0, len = topTen.length; i < len; i++){
                  tmp = data.filter(function(element){  if (element[0] == topTen[i]){ return element }});
                  tmp.sort(function( a, b ){
                    return a[1] - b[1];  
                })
                  names.push(stations[topTen[i]].slice(0,stations[topTen[i]].indexOf(" -")))
                  buildmatrix[i] = [stations[topTen[i]],tmp, [topTen[i]]];
              
               }    
                for (i = 0; i < buildmatrix.length; i++){
                  var newtotals = [];
                  count = 0;
                  for (var j = 0, len = buildmatrix[i][1].length; j <len; j++ ) {
              
                    if (j === 0){
                     count++;    
                    } else if (j == len-1) {
                      newtotals.push(count);
                      count = 0;  
                    
                    } else if (buildmatrix[i][1][j][1] === buildmatrix[i][1][j-1][1]) {
                      count++;
                      if (i==9){
                      }
                    } else if (j == len-1) {
                      newtotals.push(count);
                      count = 0;  
                    
                    } else {
                      newtotals.push(count);
                      count = 0;  
                    } 
                    tmp = [];
                    tmp[0] = newtotals[4];
                    tmp[1] = newtotals[0];
                    tmp[2] = newtotals[6];
                    tmp[3] = newtotals[2];
                    tmp[4] = newtotals[1];
                    tmp[5] = newtotals[8];
                    tmp[6] = newtotals[3];
                    tmp[7] = newtotals[7];
                    tmp[8] = newtotals[9];
                    tmp[9] = newtotals[5]; 
                    matrix[i] = tmp;  

                  }


                }
                react.dataviz.d3.drawChord(matrix, names)
                });
              },
              drawChord : function( matrix, names) {
                //based on http://bl.ocks.org/mbostock/4062006 and other D3 based examples
                var chord = d3.layout.chord()
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
                    .style("fill", function(d) { return fill(d.index); })
                    .style("stroke", function(d) { return fill(d.index); })
                    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
                    .on("mouseover", fade(.1))
                    .on("mouseout", fade(1));
                 
                 
                
                var ticks = svg.append("g").selectAll("g")
                    .data(chord.groups)
                  .enter().append("g").selectAll("g")
                    .data(groupTicks)
                  .enter().append("g")
                    .attr("transform", function(d) {
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
                    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
                    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                    .text(function(d) { return d.label; });
                
                svg.append("g")
                    .attr("class", "chord")
                  .selectAll("path")
                    .data(chord.chords)
                  .enter().append("path")
                    .attr("d", d3.svg.chord().radius(innerRadius))
                    .style("fill", function(d) { return fill(d.target.index); })
                    .style("opacity", 1);
                var arc = d3.svg.arc()
                    .innerRadius(innerRadius )
                    .outerRadius(outerRadius);
                
                 var g = svg.selectAll("g.group")
                      .data(chord.groups)
                    .enter().append("svg:g")
                      .attr("class", "group")
                      .on("mouseover", fade(.02))
                      .on("mouseout", fade(.80));
                
                  g.append("svg:path")
                      .style("stroke", function(d) { return fill(d.index); })
                      .style("fill", function(d) { return fill(d.index); })
                      .attr("d", arc);
                  g.append("svg:text")
                      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                      .attr("dy", ".35em")
                      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                      .attr("transform", function(d) {
                        var a = Math.sin( d.angle ) * (outerRadius +10),
                        b = Math.cos( d.angle ) * (outerRadius+30);
                        return "translate(" +a+","+(-b)+ ")";
                      })
                      .text(function(d) { return names[d.index]; });
                
                // Returns an array of tick angles and labels, given a group.
                function groupTicks(d) {
                  var k = (d.endAngle - d.startAngle) / d.value;
                  return d3.range(0, d.value, 1000).map(function(v, i) {
                    return {
                      angle: v * k + d.startAngle,
                      label: i % 5 ? null : v / 1000 + "k"
                    };
                  });
                }
                
                // Returns an event handler for fading a given chord group.
                function fade(opacity) {
                  return function(g, i) {
                    svg.selectAll(".chord path")
                        .filter(function(d) { return d.source.index != i && d.target.index != i; })
                      .transition()
                        .style("opacity", opacity);
                  };
                }
                
                }
            },
            _init : function(){
            
              if ($(".reveal").length){
                Reveal.addEventListener( 'slidechanged', function( event ) {
                  switch (event.currentSlide.id) {
                   case "d3":
                      $(event.currentSlide)
                        .find("iframe")
                        .attr("src","../demo/chord.html"); 
                      break;
                   case "canvas":
                      $(event.currentSlide)
                        .find("iframe")
                        .attr("src","../demo/canvas.html"); 
                      break;
                   case "angular":
                      $(event.currentSlide)
                        .find("iframe")
                        .attr("src","../demo/100k/standalone.html"); 
                      break;    
                   case "gm":
                      $(event.currentSlide)
                        .find("iframe")
                        .attr("src","../demo/hubway/src/index.html"); 
                      break;      
                   default:
                      $(event.previousSlide)
                        .find("iframe")
                        .removeAttr("src"); 
                      break;
                   }
                } );
                /*
               Initial Canvas Demo
                */
               var ctx = document.getElementById("circle").getContext("2d");
               ctx.beginPath();
               ctx.arc(400, 150, 75, 0, Math.PI*2, true); 
               ctx.fillStyle = "#fe57a1";
               ctx.closePath();
               ctx.fill();
            react.dataviz.util.support("svg");
            react.dataviz.util.support("canvas");
          }
            if (document.body.id=="d3"){
              react.dataviz.d3.init();

            } else if (document.body.id=="hc"){
              react.dataviz.hc.init();

            } else if (document.body.id=="raphael"){
              react.dataviz.raphael.init();

            }
        }
  }  }())._init();
}(window, jQuery));
