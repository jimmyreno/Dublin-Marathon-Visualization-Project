(function (DatasetGenerator, GenderChart, Timeline, d3, $) {

    'use strict';

    /*eslint no-unused-vars: 1*/
    var $overviewChart = d3.select('#gender-chart'),
        $timelineEl = d3.select('#timeline-chart'),
        defaultYear = '2013',
        currentDataset = null;
        //years = ['2013', '2014', '2015'],

    function buildCharts(dataset) {
        currentDataset = dataset;
        $overviewChart.datum(dataset).call(GenderChart.build);

        // Add the timeline chart
        var timeline = Timeline
            .width(parseInt($timelineEl.style('width')))
            .height(500)// Timeline height is fixed, width responds to container size (#timeline-chart).
            .startTime(dataset.timeline.start)
            .endTime(dataset.timeline.end);
        $timelineEl.datum(dataset.data.slice(0,8000)).call(timeline);
    }

    function main() {
        DatasetGenerator.loadYear(defaultYear, buildCharts);
    }

    function filterByClub(clubName) {
        GenderChart.filter({
            total: null,
            cat: null,
            name: null,
            club: clubName
        }, currentDataset.data);
    }

    $('#filter').click(function() {
        filterByClub('Bros Pearse A.c.');
    });

    main();

}(DatasetGenerator, GenderChart, Timeline, d3, $));
