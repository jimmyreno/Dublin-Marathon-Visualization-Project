var Timeline = (function (d3) {

    'use strict';

    var width = 700,
        height = 500,
        bgColor = '#ffffff',
        margin = { top: 30, bottom: 40, left: 70, right: 25 },
        xScale = d3.time.scale(),
        yScale = d3.scale.ordinal(),
        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(function (d) {
                var format = d3.time.format('%b %e');
                return format(new Date(d));
            })
            .tickPadding(6),
        xAxisMinor = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(d3.time.day, 1)
            .tickFormat(function () { return null; }),
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickPadding(16),
        HALF_AN_HOUR = 1000 * 60 * 30,
        ONE_HOUR = HALF_AN_HOUR * 2,
        ONE_DAY = ONE_HOUR * 24,
        FIVE_DAYS = ONE_DAY * 5,
        TEN_DAYS = ONE_DAY * 10,
        TWENTY_DAYS = ONE_DAY * 20,
        THIRTY_DAYS = ONE_DAY * 30,
        SIX_DAYS_AGO_TIMESTAMP = Date.now() - (FIVE_DAYS + ONE_DAY),
        NOW = Date.now(),
        startTime,
        endTime,
        // startTime = SIX_DAYS_AGO_TIMESTAMP,
        // endTime = NOW,
        $chart = null,
        zoom,
        zoomInLimit = 50,
        zoomOutLimit = 0.8,
        lastRedrawTime = 0;

    function resize() {
        width = parseInt(d3.select('#timeline-chart').style('width')) - margin.left - margin.right;

        xScale.range([0, width]);

        var chart = d3.select('#timeline-chart').select('svg');
        chart.attr('width', width + margin.left + margin.right);
        chart.select('.x.axis').call(xAxis);
        chart.select('.x.axisMinor').call(xAxisMinor);
        chart.select('.zoom-layer').attr('width', width);

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickPadding(16);
            yAxis.tickSize(-width);

        chart.select('.y.axis').call(yAxis);

        $chart.call(zoom.event);
    }

    function timeline(selection) {

        width = (width - margin.left - margin.right);

        selection.each(function(data) {
            // build chart

            var svg = $chart;

            function redraw() {

                lastRedrawTime++;

                console.log('redraw: ' + (lastRedrawTime % 1 === 0));

                if ((lastRedrawTime % 1 === 0)) {

                    var windowStart = xScale.invert(0),
                        windowEnd = xScale.invert(width),
                        windowWidth = windowEnd - windowStart;

                    //var singleEventMarkers = svg.selectAll('.single-event-marker');

                    var singleEventMarkers = svg.selectAll('.single-event-marker').data(data, function(d) { return d.id; });
                    singleEventMarkers.enter().append('rect')
                        .attr('width', 3)
                        .attr('height', 3)
                        .attr('class', function (d) {
                            return 'single-event-marker';
                        })
                        .attr('y', function (d) {
                            // TODO: Update
                            // var overlaps = 0;
                            // data.forEach(function(event){
                            //     if (event.id !== d.id && event.type === d.type) {
                            //         if (event.endTime > d.startTime && event.endTime < d.endTime) {
                            //             overlaps++;
                            //         }
                            //         else if (event.startTime > d.startTime && event.startTime < d.endTime) {
                            //             overlaps++;
                            //         }
                            //     }
                            // });
                            //
                            // var offset = (overlaps * 3) + 1;
                            // return yScale(d.type) - offset;
                            return yScale(d.CAT);
                        });


                    singleEventMarkers
                        //.attr('width', 3)
                        // function (d) {
                            // var x1 = xScale(d.startTime),
                            //     x2 = xScale(d.endTime);
                            //
                            // if (x1 < 0) {
                            //     x1 = 0;
                            // }
                            // else if (x2 > width) {
                            //     x2 = width;
                            // }
                            // if (x2 < 0 || x2 >= width) {
                            //     return Math.max(0, (x2 - x1 - 1));
                            // }
                            // else {
                            //     return Math.max(6, (x2 - x1 - 1));
                            // }
                        // })
                        // .attr('height', 3)
                        .attr('x', function (d) {
                            // console.log(d);
                            return Math.max(0, xScale(new Date(d.millisChip)));
                        });
                        // .attr('class', function (d) {
                        //     return 'single-event-marker';
                        // })
                        // .attr('y', function (d) {
                        //     // TODO: Update
                        //     // var overlaps = 0;
                        //     // data.forEach(function(event){
                        //     //     if (event.id !== d.id && event.type === d.type) {
                        //     //         if (event.endTime > d.startTime && event.endTime < d.endTime) {
                        //     //             overlaps++;
                        //     //         }
                        //     //         else if (event.startTime > d.startTime && event.startTime < d.endTime) {
                        //     //             overlaps++;
                        //     //         }
                        //     //     }
                        //     // });
                        //     //
                        //     // var offset = (overlaps * 3) + 1;
                        //     // return yScale(d.type) - offset;
                        //     return yScale(d.CAT);
                        // });

                    singleEventMarkers.exit().remove();


                    // rescale axes
                    if (windowWidth <= ONE_DAY) {
                        xAxis.ticks(d3.time.day, 1);
                        xAxisMinor
                            .ticks(d3.time.hour, 1)
                            .tickFormat(function (d) {
                            var format = d3.time.format('%H');
                            var hrs = format(new Date(d));
                            if (hrs === '00') {
                                return null;
                            }
                            else {
                                return hrs + ':00';
                            }
                        });
                    }
                    else if (windowWidth <= (FIVE_DAYS + ONE_DAY)) {
                        xAxis.ticks(d3.time.day, 1);
                        xAxisMinor
                            .ticks(d3.time.hour, 6)
                            .tickFormat(function (d) {
                                var format = d3.time.format('%H');
                                var hrs = format(new Date(d));
                                if (hrs === '00') {
                                    return null;
                                }
                                else {
                                    return hrs + ':00';
                                }
                            });
                    }
                    else if (windowWidth < TEN_DAYS) {
                        xAxis.ticks(d3.time.day, 1);
                        xAxisMinor.ticks(d3.time.hour, 12)
                            .tickFormat(function () { return null; });
                    }
                    else if (windowWidth < TWENTY_DAYS) {
                        xAxis.ticks(d3.time.day, 2);
                        xAxisMinor.ticks(d3.time.hour, 12)
                            .tickFormat(function () { return null; });
                    }
                    else if (windowWidth < THIRTY_DAYS) {
                        xAxis.ticks(d3.time.day, 4);
                        xAxisMinor.ticks(d3.time.day, 1)
                            .tickFormat(function () { return null; });
                    }
                    else {
                        xAxis.ticks(d3.time.hour, 1);
                        xAxisMinor.ticks(d3.time.minutes, 15)
                            .tickFormat(function () { return null; });
                    }
                    svg.select('.x.axis').call(xAxis);
                    svg.select('.x.axisMinor').call(xAxisMinor);

                    // TODO: Add winner markers here
                    // $chart.select('.now-marker')
                    //     .attr('x1', xScale(Date.now()))
                    //     .attr('x2', xScale(Date.now()))
                    //     .attr('y1', height + 10)
                    //     .attr('y2', -10)
                    //     .style('stroke', function() {
                    //         var xPos = xScale(Date.now());
                    //         if (xPos < width && xPos > 0) {
                    //             return 'teal';
                    //         }
                    //         else {
                    //             return 'transparent';
                    //         }
                    //     });

                    //console.log('setting time range to: [' + windowStart + ',' +  windowEnd + ']');
                    // viewModel.timeRange([windowStart, windowEnd]);
                }
            }

            xScale.range([0, width])
                .domain([new Date(startTime), endTime]);

            yScale.domain(['MU19', 'MS', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60', 'M65', 'M70', 'M75', 'M80',
                            'FU19', 'FS', 'F35', 'F40', 'F45', 'F50', 'F55', 'F60', 'F65', 'F70', 'F75', 'F80',])
                .rangePoints([height, 0]);

            yAxis.tickSize(-width);

            function zoomed() {
                redraw();
            }

            zoom = d3.behavior.zoom()
                .x(xScale)
                .scaleExtent([zoomOutLimit, zoomInLimit])
                .size([width, height])
                .on('zoom', zoomed);

            if (!$chart) {
                $chart = d3.select(this)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .style('background', bgColor)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .call(zoom);

                $chart.append('rect')
                    .attr('class', 'zoom-layer')
                    .attr('width', width)
                    .attr('height', height);

                $chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (height + 15) + ')')
                    .call(xAxis);

                $chart.append('g')
                    .attr('class', 'x axisMinor')
                    .attr('transform', 'translate(0,' + (height + 9) + ')')
                    .call(xAxisMinor);

                $chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                // $chart.append('line')
                //     .attr('class', 'now-marker')
                //     .attr('x1', xScale(Date.now()))
                //     .attr('x2', xScale(Date.now()))
                //     .attr('y1', height + 10)
                //     .attr('y2', -10);

                svg = $chart;
            }

            redraw();
        });

        d3.select(window).on('resize', resize);
    }

    function reset() {
        $chart = null;
        var timelineEl = d3.select('#timeline-chart');
        width = parseInt(timelineEl.style('width'));
        timelineEl.select('svg').remove();
        //timelineEl.datum(viewModel.events()).call(timeline);
    }

    timeline.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return timeline;
    };

    timeline.margin = function(value) {
        if (!arguments.length) {
            return margin;
        }
        margin = value;
        return timeline;
    };

    timeline.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return timeline;
    };

    timeline.bgColor = function(value) {
        if (!arguments.length) {
            return bgColor;
        }
        bgColor = value;
        return timeline;
    };

    timeline.startTime = function(value) {
        if (!arguments.length) {
            return startTime;
        }
        startTime = value;
        return timeline;
    };

    timeline.endTime = function(value) {
        if (!arguments.length) {
            return endTime;
        }
        endTime = value;
        return timeline;
    };

    // timeline.filterEvents = function(events) {
    //     console.log('called filter events');
    //
    //     if ($chart) {
    //
    //         $chart.selectAll('.single-event-marker').style('opacity', '0');
    //
    //         $chart.selectAll('.single-event-marker')
    //             .data(events, function(d) { return d.id; })
    //             .attr('y', function(d) {
    //                 var overlaps = 0;
    //                 events.forEach(function(event){
    //                     if (event.id !== d.id && event.type === d.type) {
    //                         if (event.endTime > d.startTime && event.endTime < d.endTime) {
    //                             overlaps++;
    //                         }
    //                         else if (event.startTime > d.startTime && event.startTime < d.endTime) {
    //                             overlaps++;
    //                         }
    //                     }
    //                 });
    //
    //                 var offset = (overlaps * 3) + 1;
    //                 return yScale(d.type) - offset;
    //             })
    //             .style('opacity', 1);
    //     }
    //
    // };

    timeline.resize = function() {
        resize();
    };

    timeline.reset = function() {
        reset();
    };

    return timeline;

}(d3));
