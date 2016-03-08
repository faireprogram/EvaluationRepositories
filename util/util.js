var fs = require('fs');
var q = require('q');
var gm = require('gm'); // graphicmagic library

var util = {};
util.msg = {};
util.args = {};
util.string = {};
util.num = {};
util.constant = {};
util.fn = {};
util.gm = {};


// Constance: server to server : {MSG_SEVER}
// client to server : {MSG_SINGLE, MSG_GROUP}
util.constant.DELIMITER_GROUP = ',';
util.constant.MSG_SINGLE = 'MSG_SINGLE';
util.constant.MSG_GROUP = 'MSG_GROUP';
util.constant.DEFAULT_PROFILE_IMG = {
    mimetype: 'image/png',
    data: fs.readFileSync('./public/resource/avatar.png')
};

// Error 
util.constant.ERROR_EXISTING_ACCOUNT = 'There\'s  existing username or email, please check it';

//TODO
// MSGTYPE: server to server : {MSG_SEVER}
//          client to server : {MSG_SINGLE, MSG_GROUP}
util.msg.validateMsgType = function(msgType) {

}

// MSGTYPE: server to server : {MSG_SEVER}
util.msg.validateMsgContent = function(msgContent) {


}

util.msg.validateFrom = function(from) {


}

util.msg.validateTo = function(to) {

}

///////////////////////////////////////////////////////////////////////
///  Util@args is used to manuplate the args and dynamic create object 
///  via new
///////////////////////////////////////////////////////////////////////
util.args.list = function(args, index) {
    return Array.prototype.slice.call(args, index);
}

util.args.construct = function(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }

    F.prototype = constructor.prototype;
    return new F();
}

///////////////////////////////////////////////////////////////////////
///  Util@args is used to manuplate the args and dynamic create object 
///  via new
///////////////////////////////////////////////////////////////////////
util.string.in = function(targetStr, groups) {
    if (!targetStr || !groups || !(groups instanceof Array)) {
        return false;
    }
    var find = false;
    groups.forEach(function(item) {
        if (targetStr === item) {
            find = true;
        }
    });
    return find;
}

util.num.isNum = function(num) {
    if (num === undefined) {
        return false;
    }
    if (typeof num === 'object') {
        return false;
    }
    if (parseInt(num).toString() !== num.toString()) {
        return false;
    }
    return true
}

// n = 4, the length output is 16
// n = 5, the length of output is 20 
util.string.uuid = function(n) {
    var num = n || 4;

    function _s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function _generate() {
        var str = "";
        for (var i = 0; i < num; i++) {
            str = str + _s4();
        }
        return str
    }
    return _generate();
}

util.string.num_uuid = function(n) {
    var max = 9999,
        min = 0,
        _default_n = n || 4;

    var _getRandomIntInclusive = function() {
        var result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (parseInt(result / 1000) != 0) {
            return result.toString();
        }
        if (parseInt(result / 100) != 0) {
            return '1' + result.toString();
        }
        if (parseInt(result / 10) != 0) {
            return '11' + result.toString();
        }
        return '111' + result.toString();
    }

    var _final_result = '';

    for (var i = 0; i < n; i++) {
        _final_result += _getRandomIntInclusive();
    }

    return _final_result;
}

// util.function
util.fn.defer = typeof setImmediate === 'function' ? setImmediate : function(fn) {
    process.nextTick(fn.bind.apply(fn, arguments))
}

// util compress
util.gm.compress = function(imgData, width, height) {
    var defer = q.defer();

    var type = imgData.mimetype.replace(/image\/|img\//g, '');
    gm(imgData.data)
        .resize(width.toString(), height.toString())
        .toBuffer(type, function(err, buffer) {

            if (err) {
                defer.reject(err);
            } else {
                defer.resolve({
                    data: buffer,
                    mimetype: imgData.mimetype
                });
            }
        });
    return defer.promise;
}


module.exports = util;