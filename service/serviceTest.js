var MongoDB = require('../db/mongodb.js');
var mongoose = require('mongoose');
var moment = require('moment');
var statictsService = require('./staticticsService.js');
mongoose.connect('mongodb://localhost/test');


// statictsService.groupWeekByUser('15d5c2f60fb573695170bde0eca78dfe').then(function(data) {
// 	console.log(data);
// }).catch(function(err) {
// 	console.log(err);
// })

// statictsService.groupWeekTotalByUser('15d5c2f60fb573695170bde0eca78dfe').then(function(data) {
// 	 console.log(data);
// })

statictsService.groupMonthByUser('15d5c2f60fb573695170bde0eca78dfe', 2016).then(function(data) {
	 console.log(data);
})


// statictsService.groupMonthTotalByUser('00001', 2016).then(function(data) {
// 	 console.log(data);
// })