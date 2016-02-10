/*eslint no-unused-vars: 1*/
var DatasetGenerator = (function (d3) {
    'use strict';

    var my = {},
        pathPrefix = '/raw_data/',
        pathSuffix = '.csv',
        dataset = null,
        splitDurations = [],
        categorySplitDurations = {};

    function isValidSplits(d) {
        return d.CHIP_TIME !== 'n/a' && d['10K'] !== 'n/a' && d.HALF !== 'n/a'
            && d['30K'] !== 'n/a' && d.FINISH_TIME !== 'n/a';
            // && d.CHIP_TIME && d.HALF && d.FINISH_TIME && d['10K'] && d['30K'];
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
        return Number.parseInt(convertSplitToSeconds(splitTo)) - Number.parseInt(convertSplitToSeconds(splitFrom));
    }

    function addToCategorySplits(splitNo, duration, category) {
        if (category && duration) {
            if (!categorySplitDurations[category]) {
                categorySplitDurations[category] = [];
            }
            if (!categorySplitDurations[category][splitNo]) {
                categorySplitDurations[category][splitNo] = [];
            }
            categorySplitDurations[category][splitNo].push(duration);
        }
    }

    function getTotalMinutesInChipTime(d) {
        var hrs = Number.parseInt(d.CHIP_TIME.split(':')[0]),
            mins = Number.parseInt(d.CHIP_TIME.split(':')[1]);
        var totalMins = (hrs * 60) + mins;
        return totalMins;
    }

    function getMillisecondsInChipTime(d) {
        var hrs = parseInt(d.split(':')[0]),
            mins = parseInt(d.split(':')[1]),
            seconds = parseInt(d.split(':')[2]),
            totalMins = (hrs * 60) + mins,
            totalSeconds = (totalMins * 60) + seconds;
        return totalSeconds * 1000;
    }

    function prepareData(theData) {

        // theData MUST BE already sorted by CHIP_TIME ASCENDING
        var currentY = 0, currentX = 0, theWinners = [], startOffset = 0,
            validatedData = [], sampleDate = new Date('01-01-2016').getTime();

        splitDurations = [];
        splitDurations[0] = [];
        splitDurations[1] = [];
        splitDurations[2] = [];
        splitDurations[3] = [];
        splitDurations[4] = [];

        theData.forEach(function(d) {
            var y = getTotalMinutesInChipTime(d);

            if (y < 420) {
                if (y > currentY) {
                    currentY = y;
                    currentX = 0;
                }
                currentX += 1;
                d.xSequence = currentX * 20;
                if (isValidSplits(d) && d.CHIP_TIME && d.CHIP_TIME !== 'n/a') {
                    startOffset = getSplitInSeconds(d.CHIP_TIME, d.FINISH_TIME);
                    d.split0 = startOffset;
                    d.split1 = getSplitInSeconds(0, d['10K']);
                    d.split2 = getSplitInSeconds(d['10K'], d.HALF);
                    d.split3 = getSplitInSeconds(d.HALF, d['30K']);
                    d.split4 = getSplitInSeconds(d['30K'], d.CHIP_TIME);

                    splitDurations[0].push(startOffset);
                    addToCategorySplits(0, startOffset, d.CAT);

                    if (d.split1) {
                        splitDurations[1].push((startOffset + d.split1));
                        addToCategorySplits(1, (startOffset + d.split1), d.CAT);
                    }
                    if (d.split2) {
                        splitDurations[2].push((startOffset + d.split1 + d.split2));
                        addToCategorySplits(2, (startOffset + d.split1 + d.split2), d.CAT);
                    }
                    if (d.split3) {
                        splitDurations[3].push((startOffset + d.split1 + d.split2 + d.split3));
                        addToCategorySplits(3, (startOffset + d.split1 + d.split2 + d.split3), d.CAT);
                    }
                    if (d.split4) {
                        splitDurations[4].push((startOffset + d.split1 + d.split2 + d.split3 + d.split4));
                        addToCategorySplits(4, (startOffset + d.split1 + d.split2 + d.split3 + d.split4), d.CAT);
                    }
                }
                else {
                    d.splits = [];
                }
                d.millisChip = sampleDate + getMillisecondsInChipTime(d.CHIP_TIME);

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

                validatedData.push(d);
            }
        });

        splitDurations.forEach(function(splitSet) {
            splitSet = splitSet.sort(d3.ascending);
        });

        Object.keys(categorySplitDurations).forEach(function(category) {
            categorySplitDurations[category].forEach(function(splitSet) {
                splitSet = splitSet.sort(d3.ascending);
            });
        });


        dataset = {
            data: validatedData,
            winners: theWinners,
            timeline : {
                start: validatedData[0].millisChip - 120000,
                end: validatedData[validatedData.length - 1].millisChip + 120000
            }
        };
    }

    function prepareRace(theData, position) {
        // theData MUST BE already sorted by CHIP_TIME ASCENDING
        var currentY = 0, currentX = 0, startOffset = 0, ret = {};
        theData.forEach(function(d, i) {
            if (getTotalMinutesInChipTime(d) < 420) {
                if (i < 3) {
                    console.log(d);
                }

                if (parseInt(d.PLACE) === position) {
                    console.log(d);
                    ret = d;
                    if (isValidSplits(d)) {
                        startOffset = getSplitInSeconds(d.CHIP_TIME, d.FINISH_TIME);

                        d.split0 = startOffset;
                        d.split1 = getSplitInSeconds(0, d['10K']);
                        d.split2 = getSplitInSeconds(d['10K'], d.HALF);
                        d.split3 = getSplitInSeconds(d.HALF, d['30K']);
                        d.split4 = getSplitInSeconds(d['30K'], d.CHIP_TIME);

                        d.split0Rank = splitDurations[0].indexOf(startOffset);
                        d.split1Rank = splitDurations[1].indexOf((startOffset + d.split1));
                        d.split2Rank = splitDurations[2].indexOf((startOffset + d.split1 + d.split2));
                        d.split3Rank = splitDurations[3].indexOf((startOffset + d.split1 + d.split2 + d.split3));
                        d.split4Rank = splitDurations[4].indexOf((startOffset + d.split1 + d.split2 + d.split3 + d.split4));

                        d.split0CatRank = categorySplitDurations[d.CAT][0].indexOf(startOffset);
                        d.split1CatRank = categorySplitDurations[d.CAT][1].indexOf((startOffset + d.split1));
                        d.split2CatRank = categorySplitDurations[d.CAT][2].indexOf((startOffset + d.split1 + d.split2));
                        d.split3CatRank = categorySplitDurations[d.CAT][3].indexOf((startOffset + d.split1 + d.split2 + d.split3));
                        d.split4CatRank = categorySplitDurations[d.CAT][4].indexOf((startOffset + d.split1 + d.split2 + d.split3 + d.split4));
                    }
                    else {
                        d.splits = [];
                    }
                }
            }
        });

        return ret;
    }

    function loadYear(year, callback) {
        d3.csv(pathPrefix + year + pathSuffix, function(data) {
            prepareData(data);
            callback(dataset);
        });
    }

    function loadRace(year, position, callback) {
        d3.csv(pathPrefix + year + pathSuffix, function(data) {
            callback(prepareRace(data, position));
        });
    }

    my.loadYear = function(year, callback) {
        loadYear(year, callback);
    };

    my.loadRace = function(year, position, callback) {
        loadRace(year, position, callback);
    };

    return my;

}(d3));
