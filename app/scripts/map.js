(function (DatasetGenerator, RaceSimulator, d3, $) {

    'use strict';

    /*eslint no-unused-vars: 1*/
    var $simulatorChart = d3.select('#simulator-chart'),
        defaultYear = '2013',
        currentDataset = null,
        map = null;

    function addMap() {
        L.mapbox.accessToken = 'pk.eyJ1IjoiamltbXlyZW5vIiwiYSI6ImNpazJxeDIxcTM5dHp2Z2x6eWtrMzlwM2YifQ.sBf-ZbVIh4urUmLd0u6JJg';

        map = L.mapbox
            .map('theMap', 'mapbox.light')
            .setView([53.3352966,-6.25055027], 15);

    }

    function drawRoute() {

        var svg = d3.select(map.getPanes().overlayPane).append('svg'),
            g = svg.append('g').attr('class', 'leaflet-zoom-hide');


        d3.json('/raw_data/DublinMarathon2013_equidistant_markers.js', function(data) {

            // TODO: remove unneeded feature

            data.features.splice(0, 1);
            //var elevationData = data.features[0].geometry.coordinates[0];
            var elevDataArray = data.features[0].geometry.coordinates[0].map(function(coord){
               return coord[2];
            });

            addElevationGraph(elevDataArray);

            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform);

            var routePath = g.selectAll('path')
                .data(data.features)
                .enter()
                .append('path');

            var markerPath, startPoint, marker;

            map.on('viewreset', reset);
            reset();
            addMarker();

            function reset() {
                //debugger;
                var bounds = path.bounds(data),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr('width', bottomRight[0] - topLeft[0])
                    .attr('height', bottomRight[1] - topLeft[1])
                    .style('left', topLeft[0] + 'px')
                    .style('top', topLeft[1] + 'px');

                g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

                routePath.attr('d', path).attr('id', 'route');
            }

            function addMarker() {
                markerPath = svg.select('#route').call(transition);
                startPoint = pathStartPoint(markerPath);
                marker = g.append("circle");
                marker.attr("r", 3)
                    .attr("id", "marker");
                    //.attr("transform", "translate(" + startPoint + ")");
            }

            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }

            //Get path start point for placing marker
            function pathStartPoint(p) {
                //debugger;
                var d = p.attr("d"),
                    dsplitted = d.split(",");
                console.log('starting ponit: ' , dsplitted[1]);
                return dsplitted[1];
            }

            function tweenDash()
             {
                var l = routePath.node().getTotalLength();
                var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
                var n = routePath.node(),
                    p = null;

                var a = 0;
                return function(t) {
                    //console.log(t,a,b);
                    var p = n.getPointAtLength(t * l);

                    marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker

                    a++;
                    if ((a % 10) == 0) {
                        //console.log('repan');
                        var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
                        map.panTo(map.layerPointToLatLng(new L.Point(p.x, p.y)), 15);
                    }
                    if (a % 500 == 0) {
                        console.log(p);
                    }
                    return i(t);
                }
            }

            function transition(thePath) {
                console.log('called!');
                thePath.transition()
                    .duration(120000)
                    .attrTween("stroke-dasharray", tweenDash)
                    .ease('linear')
                    .each("end",null);
                        //function() { d3.select(this).call(transition); });// infinite loop
              }

            var route = svg.select('#route').attr('style', 'opacity:0.2').call(
                transition);

         });

    }


    function buildCharts(dataset) {
        currentDataset = dataset;
        addMap();
        drawRoute();
    }

    function addElevationGraph(elevData) {

        // var ElevationControl = L.Control.extend({
        //     options: {
        //         position: 'bottomleft'
        //     },
        //     onAdd: function (map) {
        //         return L.DomUtil.create('svg', 'elevation-chart');
        //     }
        // });
        //
        // map.addControl(new ElevationControl());

        var svg = d3.select('#elevation-chart').append('svg')
                .attr('width', '300px')
                .attr('height', '70px'),
                .append('g');
                //.attr('class', 'leaflet-zoom-hide'),

            xScale = d3.scale.linear()
                .domain([0,2218])
                .range([0, 300]),

            yScale = d3.scale.linear()
                .domain(d3.extent(elevData, function(d) { return d;}))
                .range([0, 70]),

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom'),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left'),

            line = d3.svg.line()
                .x(function(d, i) { return i; })
                .y(function(d) { return d; });

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,70)')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        svg.append('path')
            .datum(elevData)
            .attr('class', 'elev-line')
            .attr('d', line);


    }

    function main() {
        DatasetGenerator.loadYear(defaultYear, buildCharts);
    }

    main();

}(DatasetGenerator, RaceSimulator, d3, $));
