var util = require('../util/util.js');
var moment = require('moment');

var HistoryModel = require('../model/History.js');
var mongoAPI = require('./mongodb.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var userCreate = {
	pid: '00001',
	username: "test",
	password: "1",
	email: 'zfdsfds1',
	sex: 'male',
} 

mongoAPI.register(userCreate).then((profile) => {
	console.log('profile', profile);
}).catch((error) => {
	console.log('error', error);
});


var rooms = [];

rooms.push({
	rid: 'xxxxx2',
    description: "it's a room test",
    roomName: 'test',
    owner: {
        username: 'test',
        pid: '00001'
    },
    tags: ['df1', 'df2', 'df3']
});

rooms.push({
	rid: 'xxxxx3',
    description: "it's a room test",
    roomName: 'test',
    owner: {
        username: 'test',
        pid: '00001'
    },
    tags: ['df1', 'df2', 'df3']
});

rooms.push({
	rid: 'xxxxx4',
    description: "it's a room test",
    roomName: 'test',
    owner: {
        username: 'test',
        pid: '00001'
    },
    tags: ['df1', 'df2', 'df3']
});

rooms.push({
	rid: 'xxxxx5',
    description: "it's a room test",
    roomName: 'test',
    owner: {
        username: 'test',
        pid: '00001'
    },
    tags: ['df1', 'df2', 'df3']
});

rooms.forEach(function(room) {
	mongoAPI.createChatRoom(room).then(function(room) {
		console.log(room);
	})
});


var msgs = [];

//roomId 'xxxxx2', 'xxxxx3', 'xxxxx4', 'xxxxx5'
//user id '00001'


msgs.push({
	from: "xxxxx2",
	to: "xxxxx2",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx4",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx4",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx5",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 20)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx5",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx2",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,0, 24)
});

/// Feb ////////////////////////////////////////////////
msgs.push({
	from: "xxxxx2",
	to: "xxxxx5",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx4",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx2",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 20)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx5",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx4",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx2",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,1, 24)
});

////MARCH
msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,2, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,3, 23)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,2, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,10, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,7, 22)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx2",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,5, 20)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx5",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,6, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx3",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,6, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx1",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,8, 24)
});

msgs.push({
	from: "xxxxx2",
	to: "xxxxx4",
	msgtype: 'MSG_GROUP',
	content: 'xxfsfdsfds',
    date: new Date(2016 ,11, 24)
});


msgs.forEach(function(item) {
	mongoAPI.logchat(item).then(function(data) {
		console.log(data);
	});
})