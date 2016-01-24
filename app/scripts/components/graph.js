// var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 1400 - margin.left - margin.right,
//     height = 7800 - margin.top - margin.bottom,
//     owidth = 1400 - margin.left - margin.right,
//     oheight = 500 - margin.top - margin.bottom;
//
// /*
//  * value accessor - returns the value to encode for a given data object.
//  * scale - maps value to a visual display encoding, such as a pixel position.
//  * map function - maps from data value to display value
//  * axis - sets up axis
//  */
//
//
// var convertSplitToSeconds = function(splitVal) {
//     if (!splitVal) {
//         return 0;
//     }
//     var numbers = splitVal.split(":");
//     if (numbers && numbers.length == 3) {
//         var hrs = Number.parseInt(numbers[0]),
//             mins = Number.parseInt(numbers[1]),
//             seconds = Number.parseInt(numbers[2]);
//         return ((hrs * 3600) + (mins * 60) + seconds);
//     }
//     else {
//         return 0;
//     }
// };
//
// var getSplitInSeconds = function(splitFrom, splitTo) {
//     return convertSplitToSeconds(splitTo) - convertSplitToSeconds(splitFrom);
// };
//
// // setup x
// var xValue = function(d) { return d.xSequence; },
//     xScale = d3.scale.linear().range([0, width]), // value -> display
//     xMap = function(d) { return xScale(xValue(d) + 11); }, // data -> display
//     xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
//     oxAxis = d3.svg.axis().scale(xScale).orient("bottom")
//     .tickFormat(function (d) {
//             var hrs = Math.floor(d/60),
//                 mins = d - (hrs * 60);
//             return hrs + ':' + mins;
//         });
//
// // setup y
// var yValue = function(d) {
//         var hrs = Number.parseInt(d["CHIP_TIME"].split(":")[0]),
//             mins = Number.parseInt(d["CHIP_TIME"].split(":")[1]);
//         var totalMins = (hrs * 60) + mins;
//         return totalMins;
//     },
//     yScale = d3.scale.linear().range([0, height]),
//     yMap = function(d) {
//         return yScale(yValue(d));
//     },
//     yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient("left")
//         .tickFormat(function (d) {
//             var hrs = Math.floor(d/60),
//                 mins = d - (hrs * 60);
//             return hrs + ':' + mins;
//         });
//     yAxis.tickValues([150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525]);
//
//     var oyAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient("left");
//
// // setup fill color
// var genderColorValue = function(d) { return d.CAT.substr(0,1);},
//     catColorValue = function(d) { return d.CAT; },
//     color = function(v) {
//         if (v == "M") {
//             return "#0099ff";
//         }
//         else if (v == "F") {
//             return "#ff66ff";
//         }
//         else {
//             return "#0099ff";
//         }
//     };
//
//     var genderColor = d3.scale.ordinal()
//         .domain(["M", "F", "W"])
//         .range(["#0099ff", "#ff66ff", "#0099ff"]); //w=00cc99
//
// //var s1Value = function(d) { return(d['split1']); },
// //    s1Scale = d3.scale.linear()
// //        .domain([getMinAttrVal('split1'), getMaxAttrVal('split1')])
// //        .range(['yellow','green']);
// //
// //    s1Map = function(d) {
// //        //console.log(d['split1']);
// //        return s1Scale(s1Value(d));
// //    };
//     //s1Map = function(d) { return s1Scale(s1Value(d)); };
//     //s1ColorValue = function(d) { return d['split1']; };
//
// // add the graph canvas to the body of the webpage
// var svg = d3.select("#content-container").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var overviewGraphSvg = d3.select("#overview-container").append("svg")
//     .attr("width", owidth + margin.left + margin.right)
//     .attr("height", oheight + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// // add the tooltip area to the webpage
// var tooltip = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);
//
//
// // load data
// d3.csv("/raw_data/results_by_chip.csv", function(error, data) {
//
//     var validTimes = function(d) {
//         return d['CHIP_TIME'] != 'n/a' && d['10K'] != 'n/a' && d['HALF'] != 'n/a'
//             && d['30K'] != 'n/a' && d['FINISH_TIME'] != 'n/a';
//     }
//
//     var radius = 8;
//     var arc = d3.svg.arc()
//         .outerRadius(radius)
//         .innerRadius(radius - 4);
//     var pie = d3.layout.pie()
//         .startAngle(-1.57079)
//         .endAngle(1.57079)
//         .sort(null)
//         .value(function(d) { return d.population; });
//
//
//   // change string (from CSV) into number format
//     var currentY = 0, currentX = 0, s1domain = [], s2domain = [], s3domain = [], s4domain = [];
//   data.forEach(function(d) {
//       var y = yValue(d);
//       if (y > currentY) {
//           currentY = y;
//           currentX = 0;
//       }
//       currentX+=1;
//       d.xSequence = currentX * 20;
//       if (validTimes(d)) {
//           d.split1 = getSplitInSeconds(0, d['10K']);
//           d.split2 = getSplitInSeconds(d['10K'], d['HALF']);
//           d.split3 = getSplitInSeconds(d['HALF'], d['30K']);
//           d.split4 = getSplitInSeconds(d['30K'], d['CHIP_TIME']);
//           s1domain.push(d.split1);
//           s2domain.push(d.split2);
//           s3domain.push(d.split3);
//           s4domain.push(d.split4);
//
//           d.splits = [
//               {name: 'split1', population: getSplitInSeconds(0, d['10K']) },
//               {name: 'split2', population: getSplitInSeconds(d['10K'], d['HALF']) },
//               {name: 'split3', population: getSplitInSeconds(d['HALF'], d['30K']) },
//               {name: 'split4', population: getSplitInSeconds(d['30K'], d['CHIP_TIME']) }
//           ];
//       }
//       else {
//         d.splits = [];
//       }
//   });
//
//     var getMinAttrVal = function(attrName) {
//         return d3.min(data, function(d) {
//             if (d[attrName] && d[attrName] > 0 ) {
//                 return d[attrName];
//             }
//         });
//     };
//
//     var getMaxAttrVal = function(attrName) {
//         return d3.max(data, function(d) {
//             if (d[attrName] && d[attrName] > 0 ) {
//                 return d[attrName];
//             }
//         });
//     };
//
//     var speedColors = ['#bd0026',
//                        '#f03b20',
//                        '#fd8d3c',
//                        '#feb24c',
//                        '#fed976'];
//
//     var s1Value = function(d) { return(d['split1']); },
//         s1Scale = d3.scale.quantile()
//             .domain(s1domain)
//             .range(speedColors), //['green', 'yellow', 'orange', 'red']),
//
//         s2Value = function(d) { return(d['split2']); },
//         s2Scale = d3.scale.quantile()
//             .domain(s2domain)
//             .range(speedColors), //['green', 'yellow', 'orange', 'red']),
//
//         s3Value = function(d) { return(d['split3']); },
//         s3Scale = d3.scale.quantile()
//             .domain(s3domain)
//             .range(speedColors), //['green', 'yellow', 'orange', 'red']),
//
//         s4Value = function(d) { return(d['split4']); },
//         s4Scale = d3.scale.quantile()
//             .domain(s4domain)
//             .range(speedColors), //['green', 'yellow', 'orange', 'red']),
//
//         s1Map = function(d) {
//             return s1Scale(s1Value(d));
//         },
//         arcMap = function(d) {
//             if (d.data.name == 'split1') {
//                 return s1Scale(d.value);
//             }
//             else if (d.data.name == 'split2') {
//                 return s2Scale(d.value);
//             }
//             else if (d.data.name == 'split3') {
//                 return s3Scale(d.value);
//             }
//             else if (d.data.name == 'split4') {
//                 return s4Scale(d.value);
//             }
//         },
//         barStackMap = function(d, i) {
//             if (d.name == 'split1') {
//                 return s1Scale(d.population);
//             }
//             else if (d.name == 'split2') {
//                 return s2Scale(d.population);
//             }
//             else if (d.name == 'split3') {
//                 return s3Scale(d.population);
//             }
//             else if (d.name == 'split4') {
//                 return s4Scale(d.population);
//             }
//         };
//
//
//   // don't want dots overlapping axis, so add in buffer to data domain
//   xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
//   yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
//
//   // x-axis
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", -6)
//       .style("text-anchor", "end")
//       .text("seconds");
//
//   // y-axis
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(0)")
//       .attr("y", -11)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("chip time");
//
//
//     // x-axis
//   overviewGraphSvg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + oheight + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", owidth)
//       .attr("y", -6)
//       .style("text-anchor", "end")
//       .text("seconds");
//
//   // y-axis
//   overviewGraphSvg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(0)")
//       .attr("y", -11)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("chip time");
//
//     var showGauges = false, showBarcharts = true, showDots = false, showBars = false;
//     if (showGauges) {
//
//         svg.selectAll(".pie")
//           .data(data)
//         .enter()
//         .append("g")
//           .attr("transform",
//                 function(d) {
//                     return "translate(" + xMap(d) + "," + yMap(d) + ")";
//                 }
//                )
//         .selectAll(".arc")
//           .data(function(d) { return pie(d.splits); })
//         .enter().append("path")
//           .attr("class", "arc")
//           .attr("d", arc)
//           .style("fill", arcMap);
//     }
//     else if (showBarcharts) {
//
//         var stacks = svg.selectAll(".bar-stack")
//           .data(data)
//         .enter();
//
//         for (var i = 0; i < 4; i++) {
//             stacks
//                 .append("rect")
//                 .attr("class", "bar-stack")
//                 .attr("width", 3)
//                 .attr("height", 4)
//                 .attr("transform", function(d) {
//                     //debugger;
//                     return "translate(" + xMap(d) + "," + ((i * 4) + yMap(d)) + ")";
//                 })
//                 .style("fill", function(d) {
//                     if (i == 0) {
//                         return s1Scale(d.split1);
//                     }
//                     else if (i == 1) {
//                         return s2Scale(d.split2);
//                     }
//                     else if (i == 2) {
//                         return s3Scale(d.split3);
//                     }
//                     else if (i == 3) {
//                         return s4Scale(d.split4);
//                     }
//                 })
//                 .on("mouseover", function(d) {
//                       d3.select(this).style("stroke", "white");
//                       tooltip.transition()
//                            .duration(50)
//                            .style("opacity", 1);
//                       tooltip.html(d["NAME"] + "<br/> (" + d['CHIP_TIME'] + ")")
//                            .style("left", (d3.event.pageX + 10) + "px")
//                            .style("top", (d3.event.pageY - 45) + "px");
//
//                   })
//                   .on("mouseout", function(d) {
//                       d3.select(this).style("stroke", "none");
//                       tooltip.transition()
//                            .duration(50)
//                            .style("opacity", 0);
//                   });
//         }
//
//     }
//     else if (showDots) {
//
//       // draw dots
//       var dots = svg.selectAll(".dot").data(data).enter().append("circle")
//         .filter(function(d) { return d['CHIP_TIME'].indexOf(':') > -1; })
//           .attr("class", "dot")
//           .attr("r", 6)
//           .attr("cx", xMap)
//           .attr("cy", yMap)
//           .attr('data-s1-pace', s1Map)
//             .style("fill",
//                    function(d) {
//                     return genderColor(genderColorValue(d));
//                 })
//             //.style("fill", s1Map)
//           .on("mouseover", function(d) {
//               tooltip.transition()
//                    .duration(50)
//                    .style("opacity", 1);
//               tooltip.html(d["NAME"] + "<br/> (" + d['CHIP_TIME'] + ")")
//                    .style("left", (d3.event.pageX + 10) + "px")
//                    .style("top", (d3.event.pageY - 45) + "px");
//           })
//           .on("mouseout", function(d) {
//               tooltip.transition()
//                    .duration(50)
//                    .style("opacity", 0);
//           });
//     }
//     else {
//         // draw bars
//       var bars = svg.selectAll(".bar").data(data)
//         .enter().append("rect")
//         .filter(function(d) { return d['CHIP_TIME'].indexOf(':') > -1; })
//           .attr("class", "bar")
//             .attr("width", 4)
//             .attr("height", 10)
//             .attr("transform",
//                 function(d) {
//                     return "translate(" + xMap(d) + "," + yMap(d) + ")";
//                 })
//             .style("fill",
//                    function(d) {
//                     return genderColor(genderColorValue(d));
//                 })
//             //.style("fill", s1Map)
//           .on("mouseover", function(d) {
//               d3.select(this).style("stroke", "white");
//               //d3.select(this).style("cursor", "pointer");
//               tooltip.transition()
//                    .duration(50)
//                    .style("opacity", 1);
//               tooltip.html(d["NAME"] + "<br/> (" + d['CHIP_TIME'] + ")")
//                    .style("left", (d3.event.pageX + 10) + "px")
//                    .style("top", (d3.event.pageY - 45) + "px");
//
//           })
//           .on("mouseout", function(d) {
//               d3.select(this).style("stroke", "none");
//               tooltip.transition()
//                    .duration(50)
//                    .style("opacity", 0);
//           });
//     }
//
//     //PLACE,NAME,FROM,CAT,PLACE_IN_CAT,10K,HALF,30K,CHIP_TIME,FINISH_TIME
//     var legend = d3.select(".legend-items").selectAll(".legend-item").data(genderColor.domain());
//     legend.exit().remove();
//     legend.enter().append("div")
//         .attr("class", "legend-text")
//         .text(function(d) { return d; })
//         .append("span").attr("class", "legend-dot")
//             .style("background", function(d) { return genderColor(d); });
//
// });
