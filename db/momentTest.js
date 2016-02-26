var moment = require('moment');

var date = new Date();
var now = moment(date);
var year = now.day("Sunday").get('year');
var month = now.day("Sunday").get('month');
var date = now.day("Sunday").get('date');
var sunday = now.day("Sunday").hour(0).minutes(0).seconds(0);


// var year = 2015;
// var lastYear = moment({y: year - 1, M: 11, d: 31, h:23, m:59, s:59});
// var nextYear = moment({y: year + 1, M: 0, d: 1, h:0, m:0, s:0});

// console.log(lastYear.format());
// console.log(nextYear.format());

// console.log(now.day('Monday').day(8).format());

// var lastSunday = now.day('0').hour(23).minutes(59).seconds(59).format();
// var nextMonday = now.day('8').hour(0).minutes(0).seconds(0).format();	
// console.log(lastSunday);
// console.log(nextMonday);

// var week = ['Monday', 'Tuesday', 'WensDady', 'Turesday', 'Friday', 'Saturday', 'Sunday']; 

// var monday = moment(new Date()).day(1).date();
// var sunday = moment(new Date()).day(7).date();
// console.log(sunday);

var _create_weekmap = function() {
    var map = {};
    var d = moment(new Date());
    for (var i = 1; i <= 7; i++) {
        map[d.day(i).format('YYYY-M-D')] = true;
    };
    return map;
}

console.log(_create_weekmap());