/*eslint no-unused-vars: 1*/
var DatasetGenerator = (function (d3) {
    'use strict';

    var my = {},
        pathPrefix = '/raw_data/',
        pathSuffix = '.csv',
        dataset = null,
        splitDurations = [];

    function isValidSplits(d) {
        return d.CHIP_TIME !== 'n/a' && d['10K'] !== 'n/a' && d.HALF !== 'n/a'
            && d['30K'] !== 'n/a' && d.FINISH_TIME !== 'n/a';
    }

    function convertSplitToSeconds(splitVal) {
        if (!splitVal) {
            return 0;
        }
        var numbers = splitVal.split(':');
        if (numbers && numbers.length === 3) {
            var hrs = Number.parseInt(numbers[0]),
                mins = Number.parseInt(numbers[1]),
                seconds = Number.parseInt(numbers[2]);
            return ((hrs * 3600) + (mins * 60) + seconds);
        }
        else {
            return 0;
        }
    }

    function getSplitInSeconds(splitFrom, splitTo) {
        return convertSplitToSeconds(splitTo) - convertSplitToSeconds(splitFrom);
    }

    function getTotalMinutesInChipTime(d) {
        var hrs = Number.parseInt(d.CHIP_TIME.split(':')[0]),
            mins = Number.parseInt(d.CHIP_TIME.split(':')[1]);
        var totalMins = (hrs * 60) + mins;
        return totalMins;
    }

    function prepareData(theData) {

        // theData MUST BE already sorted by CHIP_TIME ASCENDING
        var currentY = 0, currentX = 0, theWinners = [];

        splitDurations = [];
        splitDurations[0] = [];
        splitDurations[1] = [];
        splitDurations[2] = [];
        splitDurations[3] = [];

        theData.forEach(function(d) {
            var y = getTotalMinutesInChipTime(d);
            if (y > currentY) {
                currentY = y;
                currentX = 0;
            }
            currentX += 1;
            d.xSequence = currentX * 20;
            if (isValidSplits(d)) {
                d.split1 = getSplitInSeconds(0, d['10K']);
                d.split2 = getSplitInSeconds(d['10K'], d.HALF);
                d.split3 = getSplitInSeconds(d.HALF, d['30K']);
                d.split4 = getSplitInSeconds(d['30K'], d.CHIP_TIME);
                splitDurations[0].push(d.split1);
                splitDurations[1].push(d.split2);
                splitDurations[2].push(d.split3);
                splitDurations[3].push(d.split4);

                // d.splits = [
                //     {name: 'split1', population: _getSplitInSeconds(0, d['10K']) },
                //     {name: 'split2', population: _getSplitInSeconds(d['10K'], d['HALF']) },
                //     {name: 'split3', population: _getSplitInSeconds(d['HALF'], d['30K']) },
                //     {name: 'split4', population: _getSplitInSeconds(d['30K'], d['CHIP_TIME']) }
                // ];
            }
            else {
              d.splits = [];
            }

            // store winner data
            if (theWinners.length === 0) {
                theWinners.push({
                    NAME: d.NAME,
                    CHIP_TIME: d.CHIP_TIME,
                    xSequence: d.xSequence
                });
            }
            else if (theWinners.length === 1) {
                if (d.PLACE_IN_CAT === '1' && d.CAT.indexOf('F') > -1) {
                    theWinners.push({
                        NAME: d.NAME,
                        CHIP_TIME: d.CHIP_TIME,
                        xSequence: d.xSequence
                    });
                }
            }
            d.id = d.PLACE;
        });

        dataset = {
            data: theData,
            winners: theWinners
        };
    }

    function loadYear(year, callback) {
        d3.csv(pathPrefix + year + pathSuffix, function(data) {
            prepareData(data);
            callback(dataset);
        });
    }

    my.loadYear = function(year, callback) {
        loadYear(year, callback);
    };

    return my;

}(d3));
