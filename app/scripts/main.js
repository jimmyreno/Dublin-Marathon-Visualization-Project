(function (DatasetGenerator, GenderChart, d3, $) {

    'use strict';

    /*eslint no-unused-vars: 1*/
    var $overviewChart = d3.select('#gender-chart'),
        defaultYear = '2013',
        currentDataset = null;
        //years = ['2013', '2014', '2015'],

    function buildCharts(dataset) {
        currentDataset = dataset;
        $overviewChart.datum(dataset).call(GenderChart.build);
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



}(DatasetGenerator, GenderChart, d3, $));
