// (function (DatasetGenerator, RaceSimulator, d3, $) {
//
//     'use strict';
//
//     /*eslint no-unused-vars: 1*/
//     var $simulatorChart = d3.select('#simulator-chart'),
//         defaultYear = '2013',
//         currentDataset = null,
//         map = null;
//
//     function addMap() {
//
//         mapboxgl.accessToken = 'pk.eyJ1IjoiamltbXlyZW5vIiwiYSI6ImNpazJxeDIxcTM5dHp2Z2x6eWtrMzlwM2YifQ.sBf-ZbVIh4urUmLd0u6JJg';
//
//
//         // // CartoDB basemap
//         // var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//         //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//         // });
//         //
//         // map = L.mapbox
//         //     .map('theMap', null)
//         //     .setView([53.3352966, -6.25055027], 14);
//         //
//         // // add the map
//         // map.addLayer(layer);
//
//
//         map = new mapboxgl.Map({
//             container: 'theMap', // container id
//             style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
//             center: [-6.25055027, 53.3352966], // starting position
//             zoom: 15 // starting zoom
//         });
//     }
//
//     function addMileCounter() {
//
//     }
//
//     function addSplitSpeedEstimator() {
//
//     }
//
//     function addPositionEstimator(data) {
//         var PositionControl = L.Control.extend({
//             options: {
//                 position: 'bottomleft'
//             },
//             onAdd: function () {
//                 return L.DomUtil.create('div', 'overall-position-chart');
//             }
//         });
//
//         map.addControl(new PositionControl());
//         d3.select('.overall-position-chart').html('<div class="position-header">estimated overall position</div>');
//
//         var w = 180,
//             h = 70,
//             place = data.PLACE,
//             s1Est = data.split1Rank,
//             s2Est = data.split2Rank,
//             s3Est = data.split3Rank,
//             s4Est = parseInt(data.PLACE),
//             startingPosition = data.split0Rank;
//
//         var livePos = d3.select('.overall-position-chart');
//
//         livePos.selectAll('.overall-position')
//             .data([s1Est])
//             .enter()
//             .append('div')
//             .attr('class', 'position-text')
//             .text('' + startingPosition + '')
//             .transition()
//             .duration((10 / 42.2) * 60000)
//             .ease('linear')
//                 .tween('text', function(d) {
//                     var i = d3.interpolate(this.textContent, d),
//                         prec = (d + '').split('.'),
//                         round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//                     return function(t) {
//                         var t1 = Math.round(i(t) * round) / round;
//                         this.textContent = t1;
//                     };
//                 })
//
//                 .each('end', function() {
//                     d3.select(this)
//                         .data([s2Est])
//                         .transition()
//                         .duration((11.1 / 42.2) * 60000)
//                         .ease('linear')
//                             .tween('text', function(d) {
//                                 var i = d3.interpolate(this.textContent, d),
//                                     prec = (d + '').split('.'),
//                                     round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//                                 return function(t) {
//                                     var t1 = Math.round(i(t) * round) / round;
//                                     this.textContent = t1;
//                                 };
//                             })
//
//                             .each('end', function() {
//                                 d3.select(this)
//                                     .data([s3Est])
//                                     .transition()
//                                     .duration((8.9 / 42.2) * 60000)
//                                     .ease('linear')
//                                         .tween('text', function(d) {
//                                             var i = d3.interpolate(this.textContent, d),
//                                                 prec = (d + '').split('.'),
//                                                 round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//                                             return function(t) {
//                                                 var t1 = Math.round(i(t) * round) / round;
//                                                 this.textContent = t1;
//                                             };
//                                         })
//
//                                         .each('end', function() {
//                                             d3.select(this)
//                                                 .data([s4Est])
//                                                 .transition()
//                                                 .duration((12.2 / 42.2) * 60000)
//                                                 .ease('linear')
//                                                     .tween('text', function(d) {
//                                                         var i = d3.interpolate(this.textContent, d),
//                                                             prec = (d + '').split('.'),
//                                                             round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//                                                         return function(t) {
//                                                             var t1 = Math.round(i(t) * round) / round;
//                                                             this.textContent = t1;
//                                                         };
//                                                     });
//                                             });
//                                     });
//                                 });
//                         //.call(elevationTransition);
//                 //});
//     }
//
//     function addClock(data) {
//
//         // //var ClockControl = L.Control.extend({
//         // var ClockControl = mapboxgl.Control.extend({
//         //     options: {
//         //         position: 'bottomleft'
//         //     },
//         //     onAdd: function () {
//         //         return L.DomUtil.create('div', 'clock-chart');
//         //     }
//         // });
//         //
//         // map.addControl(new ClockControl());
//
//
//         //d3.select('#clock-chart').html('<div class="clock-header">hours</div><div class="clock-header">minutes</div><div class="clock-header">seconds</div>');
//
//         var w = 180,
//             h = 70,
//             completionTime = data.split1 + data.split2 + data.split3 + data.split4;
//             //i = d3.interpolateNumber(0, completionTime);
//
//         var clock = d3.select('#clock-chart');
//
//         clock.selectAll('.clock-time')
//             .data([completionTime])
//             .enter()
//             .append('div')
//             .attr('class', 'clock-text')
//             .text('0')
//             .transition()
//             .duration(60000)
//             .ease('linear')
//                 .tween('text', function(d) {
//                     var i = d3.interpolate(this.textContent, d),
//                         prec = (d + '').split('.'),
//                         round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//
//                     return function(t) {
//
//                         var t1 = Math.round(i(t) * round) / round;
//
//                         var seconds = t1 % 60,
//                             minutes = ((t1 - seconds) / 60) % 60,
//                             hours = (((t1 - seconds) / 60) - minutes) / 60;
//
//                         if (seconds < 10) {
//                             seconds = '0' + seconds;
//                         }
//                         if (minutes < 10) {
//                             minutes = '0' + minutes;
//                         }
//                         this.textContent =
//                             hours + ':' + minutes + ':' + seconds;
//                     };
//                 });
//
//         // clock
//         //     .call(clockTransition);
//         //
//         // function clockTransition(p) {
//         //     // debugger;
//         //     p.transition()
//         //         .duration(60000)
//         //         //.attrTween('stroke-dasharray', tweenDash2)
//         //         .text(function(d) {
//         //             return timeUpdater(d);
//         //         })
//         //         .ease('linear')
//         //         .each('end', null); //function() { d3.select(this).call(elevationTransition); });
//         // }
//         //
//         // function timeUpdater() {
//         //     console.log('timeUpdater');
//         //     var
//         //         // l = this.getTotalLength(),
//         //         // i = d3.interpolateString('0,' + l, l + ',' + l),
//         //         i = d3.interpolateNumber(0, completionTime);
//         //     return function(t) {
//         //         console.log(t);
//         //         // console.log(i(t));
//         //         return i(t);
//         //     };
//         // }
//     }
//
//     function addElevationGraph(elevData) {
//
//         var ElevationControl = L.Control.extend({
//             options: {
//                 position: 'bottomleft'
//             },
//             onAdd: function () {
//                 return L.DomUtil.create('div', 'elevation-chart');
//             }
//         });
//
//         map.addControl(new ElevationControl());
//
//         var w = 450,
//             h = 70,
//
//             xScale = d3.scale.linear()
//                 .domain([0, elevData.length])
//                 .range([0, w]),
//
//             yScale = d3.scale.linear()
//                 .domain(d3.extent(elevData, function(d, i) { return d; }))
//                 .range([h, 0]),
//
//             points = [];
//
//         function tweenDash2() {
//             console.log('tween dash');
//             var l = this.getTotalLength(),
//                 i = d3.interpolateString('0,' + l, l + ',' + l);
//             return function(t) {
//                 return i(t);
//             };
//         }
//
//         function elevationTransition(p) {
//             p.transition()
//                 .duration(60000)
//                 .attrTween('stroke-dasharray', tweenDash2)
//                 .ease('linear')
//                 .each('end', null); //function() { d3.select(this).call(elevationTransition); });
//         }
//
//         elevData.forEach(function(point, i) {
//             points.push([xScale(i), yScale(point)]);
//         });
//
//         var line = d3.svg.line()
//                 .tension(0.7)
//                 .interpolate('linear'),
//
//             svg = d3.select('.elevation-chart').append('svg')
//                 .datum(points)
//                 .attr('width', w)
//                 .attr('height', h);
//                 // .append('g'),
//                 //.attr('class', 'leaflet-zoom-hide'),
//
//         svg.append('path')
//             .style('fill', 'none')
//             .style('stroke', '#ccc')
//             .style('stroke-width', '1px')
//             .style('stroke-dasharray', '1,2')
//             .attr('d', line);
//
//         svg.append('path')
//             //.attr('class', 'elev-line')
//             .style('fill', 'none')
//             .style('stroke', '#333')
//             .attr('d', line)
//             .call(elevationTransition);
//
//
//
//
//     }
//
//     function drawRoute() {
//
//         var container = map.getCanvasContainer(),
//             svg = d3.select(container).append('svg'),
//
//         //var svg = d3.select(map.getPanes().overlayPane).append('svg'),
//             g = svg.append('g').attr('class', 'leaflet-zoom-hide');
//
//
//         d3.json('/raw_data/DublinMarathon2013_equidistant_markers.js', function(data) {
//
//             data.features.splice(0, 1);
//
//             var routePath = g.selectAll('path')
//                 .data(data.features)
//                 .enter()
//                 .append('path');
//
//             var markerPath, startPoint, marker;
//
//             function projectPoint(lng, lat) {
//                 //var point = map.latLngToLayerPoint(new L.LatLng(y, x));
//                 var point = map.project(new mapboxgl.LngLat(lng, lat));
//                 this.stream.point(point.x, point.y);
//             }
//
//             var transform = d3.geo.transform({point: projectPoint});
//             var path = d3.geo.path().projection(transform);
//
//             function reset() {
//                 var bounds = path.bounds(data),
//                     topLeft = bounds[0],
//                     bottomRight = bounds[1];
//
//                 svg.attr('width', bottomRight[0] - topLeft[0])
//                     .attr('height', bottomRight[1] - topLeft[1])
//                     .style('left', topLeft[0] + 'px')
//                     .style('top', topLeft[1] + 'px');
//
//                 g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');
//
//                 routePath.attr('d', path).attr('id', 'route');
//
//             }
//
//             function tweenDash(){
//                 var l = routePath.node().getTotalLength();
//                 var i = d3.interpolateString('0,' + l, l + ',' + l); // interpolation of stroke-dasharray style attr
//                 var n = routePath.node(),
//                     p = null,
//                     newCenter = null;
//
//                 var a = 0;
//                 return function(t) {
//                     //console.log(t,a,b);
//                     p = n.getPointAtLength(t * l);
//
//                     marker.attr('transform', 'translate(' + p.x + ', ' + p.y + ')'); //move marker
//
//                     a++;
//                     if ((a % 200) === 0) {
//                         //console.log('repan');
//                         // newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
//                         // map.panTo(map.layerPointToLatLng(new L.Point(p.x, p.y)), 15);
//
//                         newCenter = map.unproject([p.x, p.y]);
//                         console.log(newCenter);
//                         map.panTo(newCenter, 15);
//                         // map.jumpTo({
//                         //     center: newCenter,
//                         //     zoom: 15
//                         // })
//                     }
//                     if (a % 500 === 0) {
//                         console.log(p);
//                     }
//                     return i(t);
//                 };
//             }
//
//             function transition(thePath) {
//                 console.log('called!');
//                 thePath.transition()
//                     .duration(60000)
//                     .attrTween('stroke-dasharray', tweenDash)
//                     .ease('linear')
//                     .each('end', null);
//                         //function() { d3.select(this).call(transition); });// infinite loop
//               }
//
//               //Get path start point for placing marker
//               function pathStartPoint(p) {
//                   //debugger;
//                   var d = p.attr('d'),
//                       dsplitted = d.split(',');
//                   console.log('starting ponit: ', dsplitted[1]);
//                   return dsplitted[1];
//               }
//
//             function addMarker() {
//                 markerPath = svg.select('#route').call(transition);
//                 startPoint = pathStartPoint(markerPath);
//                 marker = g.append('circle');
//                 marker.attr('r', 3)
//                     .attr('id', 'marker');
//                     //.attr('transform', 'translate(" + startPoint + ")');
//             }
//
//
//
//
//             // TODO: remove unneeded feature
//             // data.features.splice(0, 1);
//             //var elevationData = data.features[0].geometry.coordinates[0];
//             var elevDataArray = data.features[0].geometry.coordinates[0].map(function(coord){
//                return coord[2];
//             });
//
//             //addElevationGraph(elevDataArray);
//
//
//
//             map.on('viewreset', reset);
//             reset();
//             addMarker();
//
//
//             var route = svg.select('#route').attr('style', 'opacity:0.2').call(
//                 transition);
//
//          });
//
//     }
//
//
//     function buildCharts(dataset) {
//         currentDataset = dataset;
//         addMap();
//         drawRoute();
//     }
//
//     function buildSimulator(dataset) {
//         addClock(dataset);
//         //addPositionEstimator(dataset);
//     }
//
//
//     function main() {
//         DatasetGenerator.loadYear(defaultYear, buildCharts);
//         DatasetGenerator.loadRace(defaultYear, 5365, buildSimulator);
//     }
//
//     main();
//
// }(DatasetGenerator, RaceSimulator, d3, $));
