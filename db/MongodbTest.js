var MongoDB = require('./mongodb.js');
var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/test');

var user = {
        input: "kkkkkkk",
        password: "1"
    }
    // @@@@ checklogin test
    // MongoDB.checklogin(user).then((status) => {
    // 	console.log(status);
    // }).catch((status) => {
    // 	console.log('status', status);
    // 	console.log('failedreason', failedreason);
    // })

//@@@@ userCreate test
// var userCreate = {
// 	username: "kkkkkkk1",
// 	password: "1",
// 	email: 'zfdsfds1',
// 	sex: 'male',
// }

// MongoDB.register(userCreate).then((profile) => {
// 	console.log('profile', profile);
// }).catch((error) => {
// 	console.log('error', error);
// })

// @@@@ History test
// var msg = {
// 	from: "xxxxx2",
// 	to: "xxxxx2",
// 	msgtype: 'MSG_GROUP',
// 	content: 'xxfsfdsfds',
//     date: new Date('2016-02-23')
// };

// MongoDB.logchat(msg).then((saveObj) => {
// 	console.log(saveObj);
// }).catch((err) => {
// 	console.log(err);
// });


// var chatRoom = {
//     description: "it's a room test",
//     roomName: 'test',
//     owner: {
//         username: '123',
//         pid: 'ljfdljslfj'
//     },
//     tags: ['df1', 'df2', 'df3']
// };

// MongoDB.createChatRoom(chatRoom).then(function(createdObject) {
// 	console.log(createdObject);
// });


// MongoDB.findChatRoomById('983735865963').then(function(findObject) {
// 	console.log(findObject);
// });

// MongoDB.closeRoom('091950837888').then(function(findObject) {
// 	console.log(findObject);
// });

// MongoDB.isRoomLive('514314018065').then(function(live) {
// 	console.log('live', live);
// });

// MongoDB.findAllRooms('ljfdljslfj').then((findRoom) => {
//     console.log(findRoom);
// })

// MongoDB.findAllLivesRoom().then((findRoom) => {
//     console.log(findRoom);
// });

// MongoDB.aggregateDateByUserId('504947123706').then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.aggregateMonthDateById('xxxxx2', 2016).then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.aggregateCurrentWeekTotal('xxxxx2').then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.aggregateMonthTotal('xxxxx2', 2016).then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.groupMonthByUser('00001', 2016).then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.groupMonthTotalByUser('00001', 2016).then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.groupWeekByUser('00001').then(function(results) {
//     var week = ['Monday', 'Tuesday', 'WensDady', 'Turesday', 'Friday', 'Saturday', 'Sunday'];
//     var monday = moment(new Date()).day(1).date();
//     var sunday = moment(new Date()).day(7).date();
//     var rooms = {};

//     results.forEach(function(result) {
//         if (!rooms[result.rid]) {
//             rooms[result.rid] = [];
//         }
//         rooms[result.rid].push(result);
//     });

//     // rooms.forEach(function(room) {

//     // });

//     var _create_weekmap = function() {
//         var map = {};
//         var d = moment(new Date());
//         for (var i = 1; i <= 7; i++) {
//            map[d.day(i).format('YYYY-M-D')] = true;
//         };
//         return map;
//     }

//     for (var roomId in rooms) {
//         var week = _create_weekmap();
//         rooms[roomId].forEach(function(roomstatics) {
//             if (roomstatics.key in week) {
//                 delete week[roomstatics.key];
//             };
//         });

//         for(var i in week) {
//             var da = moment(i, 'YYYY-M-D');
//             var emptyWeek = {
//                 key : i,
//                 rid : roomId,
//                 year : da.year(),
//                 date : da.date(),
//                 count : 0
//             }
//             rooms[roomId].push(emptyWeek);
//         }
//         var sortedRoom = rooms[roomId].sort(function(r1, r2) {
//            return r1.key > r2.key ?   1 : (r1.key === r2.key ? 0 : -1);
//         });

//         rooms[roomId] = sortedRoom;
//     };

// }).catch(function(err) {
//     console.log(err);
// });

// MongoDB.groupWeekTotalByUser('00001').then(function(result) {
//     console.log(result);
// }).catch(function(err) {
//     console.log(err);
// });


// var search = {
//     username: 'fds'
// };

// var search = {
//     tag: 'fd'
// };

// var search = {
//     name: 'Qipa'
// };

// search = null;
// var page = {
//     currentRecords: 0,
//     maxPer: 3
// }
// MongoDB.findRoomByMulitpleConditons(search, page).then(function(result) {
//     console.log(result);
// });


// MongoDB.updateRoomstatus('854115159618', true).then(function(result) {
//     console.log(result.status);
// })

MongoDB.findAllLivesRoom('424b0176f6f101f4d2c84279dffbf223').then(function(result) {
    console.log(result.length);
})