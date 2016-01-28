/*eslint no-unused-vars: 1*/
var GenderChart = (function () {

    'use strict';

    var width = 1366,
        height = 360,
        year = '2013',
        backgroundColor = 'transparent',
        margin = { top: 20, right: 20, bottom: 70, left: 40 },
        resultsFilter = {
            total: 10,
            cat: null,
            name: null,
            club: null
        },

        // setup x
        xValue = function(d) {
            var hrs = Number.parseInt(d.CHIP_TIME.split(':')[0]),
                mins = Number.parseInt(d.CHIP_TIME.split(':')[1]),
                totalMins = (hrs * 60) + mins;
            return totalMins;
        },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d)); },
        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(function (d) {
                var hrs = Math.floor(d / 60),
                    mins = d - (hrs * 60);
                if (mins) {
                    return hrs + ':' + mins;
                }
                else {
                    return hrs + ':00';
                }
            })
            .tickValues([150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525])
            .tickPadding(1),

        // setup y
        yValue = function(d) {
            return d.xSequence;
        },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) {
            return yScale(yValue(d) + 11);
        },
        yAxis = d3.svg.axis().scale(yScale).orient('left'),

        // graph colors
        genderColorValue = function(d) {
            return d.CAT.substr(0, 1);
        },
        catColorValue = function(d) {
            return d.CAT;
        },
        color = function(v) {
            if (v === 'M') {
                return '#0099ff';
            }
            else if (v === 'F') {
                return '#ff66ff';
            }
            else {
                return '#0099ff';
            }
        },
        genderColor = d3.scale.ordinal()
            .domain(['M', 'F', 'W'])
            .range(['#0099ff', '#ff66ff', '#0099ff']), //w=00cc99

        tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

    var theGenderChart = {};

    theGenderChart.build = function(selection) {

        selection.each(function(dataset) {
            var data = dataset.data,
                selectionEl = d3.select(this);

            //theGenderChart.data = data;

            // generate chart here; 'd' is the data and 'this' is the element
            selectionEl.style('background', backgroundColor);
            selectionEl.style('width', width + 'px');
            selectionEl.style('height', height + 'px');

            // now create the viz components

            xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
            yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

            var svg = selectionEl.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // x-axis
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis)
              .append('text')
                .attr('class', 'label')
                .attr('x', width)
                .attr('y', 26)
                .style('text-anchor', 'end')
                .text('chip time');

            // y-axis
            // svg.append('g')
            //     .attr('class', 'y axis')
            //     .call(yAxis)
            //   .append('text')
            //     .attr('class', 'label')
            //     .attr('transform', 'rotate(0)')
            //     .attr('y', -11)
            //     .attr('dy', '.71em')
            //     .style('text-anchor', 'end')
            //     .text('seconds');

            // draw dots
            var dots = svg.selectAll('.dot')
                .data(data, function(d) { return d.id; })
                .enter().append('circle')
                .filter(function(d) { return d.CHIP_TIME.indexOf(':') > -1; })
                .attr('class', 'dot')
                .attr('r', 1.5)
                .attr('cx', xMap)
                .attr('cy', yMap)
                //.attr('id', function(d) { return d.id;})
                .style('fill', function(d) {
                    // Check if a filter is present
                    if (resultsFilter.club || resultsFilter.name || resultsFilter.cat) {

                        // check if we pass the filter
                        if (d.CAT === resultsFilter.cat || d.FROM === resultsFilter.club || d.NAME.substr(resultsFilter.name) > -1) {
                            return genderColor(genderColorValue(d));
                        }
                        else {
                            return '#ddd';
                        }
                    }
                    return genderColor(genderColorValue(d));
                })
                .on('mouseover', function(d) {
                    tooltip.transition()
                         .duration(50)
                         .style('opacity', 1);
                    tooltip.html(d.NAME + '<br/> (' + d.CHIP_TIME + ')')
                         .style('left', (d3.event.pageX + 10) + 'px')
                         .style('top', (d3.event.pageY - 45) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.transition()
                         .duration(50)
                         .style('opacity', 0);
                });

            var rs = d3.select('#results-table').selectAll('.result-row')
                .data(data.filter(function(d, i) {
                    return (d.CAT === resultsFilter.cat || resultsFilter.cat === null)
                        && (d.FROM === resultsFilter.club || resultsFilter.club === null)
                        && (d.NAME.substr(resultsFilter.name) > -1 || resultsFilter.name === null);

                }).filter(function(d, i) {
                    return !resultsFilter.total || (i < resultsFilter.total);

                }),
                function(d) { return d.id; }
            );

            var rows = rs
                .enter().append('tr').attr('class', 'result-row').attr('id', function(d) { return 'row-place-' + d.id; });


            rows.append('th').attr('scope', 'row').text(function(d) { return d.PLACE; });
            rows.append('td').text(function(d) { return d.NAME; });
            rows.append('td').text(function(d) { return d.CAT; });
            rows.append('td').text(function(d) { return d.PLACE_IN_CAT; });
            rows.append('td').text(function(d) { return d.FROM; });

            dataset.winners.forEach(function(winner, i) {
                svg.append('line')
                    .attr('class', 'winner-marker')
                    .attr('x1', xMap(winner))
                    .attr('x2', xMap(winner))
                    .attr('y1', (height + 3))
                    .attr('y2', (height + 58) - (i * 23))
                    .attr('class', 'winner-marker');

                svg.append('text')
                    .attr('x', xMap(winner) - 1)
                    .attr('y', (height + 68) - (i * 23))
                    .attr('class', 'winner-marker-text')
                    .text(winner.NAME);
            });
        });
    };

    theGenderChart.filter = function(theFilter, theDataset) {

        var dots = d3.selectAll('.dot')
            .style('fill', function(d) {
                // Check if a filter is present
                if (theFilter.club || theFilter.name || theFilter.cat) {

                    // check if we pass the filter
                    if (d.CAT === theFilter.cat || d.FROM === theFilter.club || d.NAME.substr(theFilter.name) > -1) {
                        return genderColor(genderColorValue(d));
                    }
                    else {
                        return '#ddd';
                    }
                }
                return genderColor(genderColorValue(d));
            });

            var rs = d3.select('#results-table').selectAll('.result-row')
                .data(theDataset.filter(function(d, i) {
                    return (d.CAT === theFilter.cat || d.FROM === theFilter.club ||
                         d.NAME.substr(theFilter.name) > -1);
                }),
                function(d) { return d.id; }
            );

            var rows = rs
                .enter().append('tr').attr('class', 'result-row');

            rows.append('th').attr('scope', 'row').text(function(d) { return d.PLACE; });
            rows.append('td').text(function(d) { return d.NAME; });
            rows.append('td').text(function(d) { return d.CAT; });
            rows.append('td').text(function(d) { return d.PLACE_IN_CAT; });
            rows.append('td').text(function(d) { return d.FROM; });

            rs.exit().remove();

        return theGenderChart;
    };

    theGenderChart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return theGenderChart;
    };

    theGenderChart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return theGenderChart;
    };

    theGenderChart.year = function(value) {
        if (!arguments.length) {
            return year;
        }
        year = value;
        return theGenderChart;
    };

    theGenderChart.backgroundColor = function(value) {
        if (!arguments.length) {
            return backgroundColor;
        }
        backgroundColor = value;
        return theGenderChart;
    };

    theGenderChart.resultsFilter = function(value) {
        if (!arguments.length) {
            return resultsFilter;
        }
        resultsFilter = value;
        return theGenderChart;
    };

    return theGenderChart;

}());
