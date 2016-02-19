var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema  = new Schema({
	rid: String,

	description: {
		createDate: Date,
	},

	owner: String
});

module.exports = mongoose.model('History', HistorySchema);