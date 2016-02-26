var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
	hid: String,
    from: String,
    to: String,
    msgtype: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', HistorySchema);