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
    var d = moment().startOf('week');
    for (var i = 0; i <= 6; i++) {
        map[d.day(i).format('YYYY-M-D')] = true;
    };
    return map;
}

console.log(_create_weekmap());
// var date1 = new Date(2016, 2, 22);
// console.log(moment(date1).day(0).format());

// var date2 = new Date(2016, 2, 23);
// console.log(moment(date2).day(0).format());

// var date3 = new Date(2016, 2, 24);
// console.log(moment(date3).day(0).format());

// var date4 = new Date(2016, 2, 25);
// console.log(moment(date4).day(0).format());

// var date5 = new Date(2016, 2, 26);
// console.log(moment(date5).day(0).format());

// var date6 = new Date(2016, 2, 27);
// console.log(moment(date6).day(0).format());

// var date0 = new Date(2016, 2, 28, 0, 0, 0);
// // console.log(moment(date0).day(0).format());
// var start = moment().startOf('week');
// var end = moment().endOf('week');
// console.log('start' , start.date());
// console.log('end' , end.date());