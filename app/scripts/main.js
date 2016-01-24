(function (DatasetGenerator, GenderChart, d3) {

    'use strict';

    /*eslint no-unused-vars: 1*/
    var $overviewChart = d3.select('#gender-chart'),
        defaultYear = '2013';
        //years = ['2013', '2014', '2015'],

    function buildCharts(dataset) {
        $overviewChart.datum(dataset).call(GenderChart);
    }

    function main() {
        DatasetGenerator.loadYear(defaultYear, buildCharts);
    }

    main();

}(DatasetGenerator, GenderChart, d3));
