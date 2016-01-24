/*eslint no-unused-vars: 1*/
var GenderChart = (function () {

    'use strict';

    var width = 1366,
        height = 400,
        year = '2013',
        backgroundColor = 'transparent',
        margin = { top: 20, right: 20, bottom: 30, left: 40 },

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
                return hrs + ':' + mins;
            })
            .tickValues([150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525]),

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

    function theGenderChart(selection) {

        selection.each(function(data) {
            var selectionEl = d3.select(this);
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
                .attr('y', -6)
                .style('text-anchor', 'end')
                .text('chip time');

            // y-axis
            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
              .append('text')
                .attr('class', 'label')
                .attr('transform', 'rotate(0)')
                .attr('y', -11)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('seconds');

            // draw dots
            var dots = svg.selectAll('.dot').data(data).enter().append('circle')
              .filter(function(d) { return d.CHIP_TIME.indexOf(':') > -1; })
                .attr('class', 'dot')
                .attr('r', 1)
                .attr('cx', xMap)
                .attr('cy', yMap)
                .style('fill', function(d) {
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
        });
    }

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

    return theGenderChart;

}());
