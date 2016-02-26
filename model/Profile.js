var mongoose = require('mongoose');
var lpm = require('passport-local-mongoose');
var Schema = mongoose.Schema;

/**
 * used to store user profile information
 **/
/**
 *  TODO, Profile Image
 **/
var ProfileSchema  = new Schema({
	pid: String,
	username: String,
	password: String,
	email: String,
	gender: String,
	address: String,
	friends: [Schema.Types.Mixed],
	likeRooms: [Schema.Types.Mixed],
	login: {
		date: Date,
		position: String
	},
	verify: {
		status: Boolean,
		code: String,
		createDate: Date
	},
	level: {
		level : Number,
		experience: Number
	},
	balance: {
		credit: Number,
		balance: Number
	},
	preference: {
		schema: String
	},
	profileImg: String
});

ProfileSchema.plugin(lpm, {usernameQueryFields : ['email']});
module.exports = mongoose.model('profile', ProfileSchema);
