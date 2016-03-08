var MongoDB = require('../db/mongodb.js');
var mongoose = require('mongoose');
var moment = require('moment');
var Q = require('q');


var staticService = {};

staticService.groupWeekByUser = function(pid) {
	var defer = Q.defer();

    MongoDB.groupWeekByUser(pid).then(function(results) {
        var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var rooms = {};

        results.forEach(function(result) {
            if (!rooms[result.rid]) {
                rooms[result.rid] = [];
            }
            rooms[result.rid].push(result);
        });

        var _create_weekmap = function() {
            var map = {};
            var d = moment().startOf('week');
            for (var i = 0; i <= 6; i++) {
                map[d.day(i).format('YYYY-M-D')] = true;
            };
            return map;
        };

        for (var roomId in rooms) {
            var rname = rooms[roomId].length ? rooms[roomId][0].rname : roomId;
            var week = _create_weekmap();
            rooms[roomId].forEach(function(roomstatics) {

            	roomstatics.week = weekNames[moment(roomstatics.key, 'YYYY-M-D').day()];
                if (roomstatics.key in week) {
                    delete week[roomstatics.key];
                };
            });

            for (var i in week) {
                var da = moment(i, 'YYYY-M-D');
                var emptyWeek = {
                    key: i,
                    rid: roomId,
                    rname: rname,
                    year: da.year(),
                    date: da.date(),
                    count: 0,
                    week: weekNames[da.day()]
                };
                rooms[roomId].push(emptyWeek);
            };

            var sortedRoom = rooms[roomId].sort(function(r1, r2) {
                var r1Date = moment(r1.key, 'YYYY-M-D');
                var r2Date = moment(r2.key, 'YYYY-M-D');
                var equal = r1Date.isSame(r2Date.format(), 'day');
                var great = r1Date.isAfter(r2Date.format());
                return great ? 1 : (equal ? 0 : -1);
            });

            rooms[roomId] = sortedRoom;
        };

        defer.resolve(rooms);

    }).catch(function(err) {
        defer.reject(rooms);
    });

    return defer.promise;
};

staticService.groupMonthByUser = function(pid, year) {
	var defer = Q.defer();

    MongoDB.groupMonthByUser(pid, year).then(function(results) {
    	console.log(results);
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var rooms = {};

        results.forEach(function(result) {
            if (!rooms[result.rid]) {
                rooms[result.rid] = [];
            }
            rooms[result.rid].push(result);
        });

        var _create_weekmap = function() {
            var map = {};
            var d = moment(year, 'YYYY');
            for (var i = 0; i <= 11; i++) {
                map[d.month(i).format('YYYY-M')] = true;
            };
            return map;
        };

        for (var roomId in rooms) {
            var months = _create_weekmap();
            rooms[roomId].forEach(function(roomstatics) {

            	roomstatics.monthName = monthNames[moment(roomstatics.key, 'YYYY-M').month()];
                if (roomstatics.key in months) {
                    delete months[roomstatics.key];
                };
            });

            for (var i in months) {
                var da = moment(i, 'YYYY-M');
                var emptyMonth = {
                    key: i,
                    rid: roomId,
                    rname: rooms[roomId].rname,
                    month: da.month() + 1,
                    year: da.year(),
                    count: 0,
                    monthName: monthNames[da.month()]
                }
                rooms[roomId].push(emptyMonth);
            };

            var sortedRoom = rooms[roomId].sort(function(r1, r2) {
                return r1.month > r2.month ? 1 : (r1.month === r2.month ? 0 : -1);
            });

            rooms[roomId] = sortedRoom;
        };

        defer.resolve(rooms);

    }).catch(function(err) {
        defer.reject(rooms);
    });

    return defer.promise;
};

staticService.groupWeekTotalByUser = function(pid) {
	var defer = Q.defer();

	MongoDB.groupWeekTotalByUser(pid).then(function(results) {
		defer.resolve(results);
	});

	return defer.promise;
}

staticService.groupMonthTotalByUser = function(pid, year) {
	var defer = Q.defer();

	MongoDB.groupMonthTotalByUser(pid, year).then(function(results) {
		defer.resolve(results);
	});

	return defer.promise;
}

module.exports = staticService;