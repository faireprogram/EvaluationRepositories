var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema  = new Schema({
	rid: String,

	description: {
		description: String
	},

	owner: {
		username: String,
		pid: String
	},

	tags: [String],

	status: {
		createDate: {type: Date, default: Date.now},
		closeDate: Date,
		open: {type: Boolean, default: true}
	}
});

module.exports = mongoose.model('ChatRoom', RoomSchema);