var MongoDB = require('./mongodb.js');
var mongoose = require('mongoose');
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
// 	from: "xxxxx1",
// 	to: "xxxxx2",
// 	msgtype: 'MSG_SINGLE',
// 	content: 'xxfsfdsfds'
// };

// MongoDB.logchat(msg).then((saveObj) => {
// 	console.log(saveObj);
// }).catch((err) => {
// 	console.log(err);
// });


var chatRoom = {
    description: "it's a room test",
    roomName: 'test',
    owner: {
        username: '123',
        pid: 'ljfdljslfj'
    },
    tags: ['df1', 'df2', 'df3']
};

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

MongoDB.findAllLivesRoom().then((findRoom) => {
    console.log(findRoom);
});