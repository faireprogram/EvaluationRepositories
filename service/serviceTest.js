var MongoDB = require('../db/mongodb.js');
var mongoose = require('mongoose');
var moment = require('moment');
var statictsService = require('./staticticsService.js');
mongoose.connect('mongodb://localhost/test');


// statictsService.groupWeekByUser('00001').then(function(data) {
// 	// console.log(data);
// })

// statictsService.groupWeekTotalByUser('00001').then(function(data) {
// 	 console.log(data);
// })

// statictsService.groupMonthByUser('00001', 2016).then(function(data) {
// 	 console.log(data);
// })


statictsService.groupMonthTotalByUser('00001', 2016).then(function(data) {
	 console.log(data);
})