var util = require('../util/util.js');

var HistoryModel = require('../model/History.js');
var ProfileModel = require('../model/Profile.js');
var RoomModel = require('../model/Room.js');

var Q = require('q');


var MongoDB = {};
///////////////////////////////////////////////////////////////////////
///  Login Part
///////////////////////////////////////////////////////////////////////

//  user.input => {user.username, or user.email}, user.password
MongoDB.checklogin = function(user) {
    console.log('user', user);
    var defer = Q.defer();
    ProfileModel.authenticate()(user.input, user.password, (err, status, failedreason) => {
        if (!!status) { // if login failed, print failed
            defer.resolve(status);
        } else { // print success
            defer.reject(failedreason);
        }
    });
    return defer.promise;
}

// find User By Email or UserName
MongoDB.findUserByEmailOrUserName = function(user) {
    var defer = Q.defer();
    var queryOrParameters = [{
        username: user.username
    }, {
        email: user.username
    }];
    ProfileModel.findOne({
        $or: queryOrParameters
    }).exec((error, existingUser) => {
        // if 
        if (!!error || !existingUser) {
            defer.reject(error);
        } else {
            defer.resolve(existingUser);
        }
    });
    return defer.promise;
}

/**
 *	user : {id, username, email, balance{credit, balance}}
 **/
MongoDB.register = function(user) {
    var defer = Q.defer();
    var _default_verify = {
        status: false,
        code: util.string.uuid(8),
        createDate: new Date
    }

    var _default_level = {
        level: 0,
        experience: 0
    }

    var _default_balance = {
        credit: 0,
        balance: 0
    }


    var _default_user = new ProfileModel({
        pid: util.string.uuid(8),
        username: user.username,
        email: user.email,
        sex: user.sex,
        verify: _default_verify,
        level: _default_level,
        balance: _default_balance
    });

    // try to find by Email or UserName
    // if not found ,then create
    // else gives a error
    this.findUserByEmailOrUserName(user).then(() => {
        //_default_user
        defer.reject(util.constant.ERROR_EXISTING_ACCOUNT);
    }, () => {
        ProfileModel.register(_default_user, user.password, (err, user) => {
            if (!!err) {
                defer.reject(err);
            } else {
                defer.resolve(user);
            }
        });
    });

    return defer.promise;
}

///////////////////////////////////////////////////////////////////////
///  Chat History Part
///////////////////////////////////////////////////////////////////////

// history
MongoDB.findByChatID = function(msg) {
    var defer = Q.defer();
    var _get_chatid = function() {
        if (msg.type === util.constant.MSG_SINGLE) {
            return msg.from > msg.to ? msg.from + msg.to : msg.to + msg.from;
        }

        if (msg.type === util.constant.MSG_GROUP) {
            return msg.to;
        }
    }

    var _create_empty_history = function() {
        var defer1 = Q.defer();
        var _default_history = {
            hid: _get_chatid(),
            msgs: []
        };

        var historyModel = new HistoryModel(_default_history);
        historyModel.save((err, saveObj) => {
            if (err) {
                defer1.reject(err);
            } else {
                defer1.resolve(saveObj);
            }
        });

        return defer1.promise;
    }

    // find history by id
    HistoryModel.findOne({
        hid: _get_chatid()
    }).exec((error, existingHistory) => {
        if (error || !existingHistory) {
            //if history not exist, create a new one
            _create_empty_history().then((newHisotry) => {
                defer.resolve(newHisotry);
            });
        }

        // if history found, then resolve it
        if (existingHistory) {
            defer.resolve(existingHistory);
        }
    });

    return defer.promise;
}

MongoDB.logchat = function(msg) {
    var defer = Q.defer();

    this.findByChatID(msg).then((history) => {
        var msgs = history.msgs.push(msg);
        history.save((err, savedObj) => {
            if (err || !savedObj) {
                defer.reject(err);
            } else {
                defer.resolve(savedObj);
            }
        });
    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
}

///////////////////////////////////////////////////////////////////////
///  ChatRooms Part
///////////////////////////////////////////////////////////////////////

MongoDB.createChatRoom = function(chatRoom) {
    var defer = Q.defer();
    var _default_chatRoom = {
        rid: util.string.num_uuid(3),
        roomName: chatRoom.roomName,
        description: chatRoom.description,
        style: chatRoom.schema,
        owner: chatRoom.owner,
        tags: chatRoom.tags
    }

    var roomPersist = new RoomModel(_default_chatRoom);
    roomPersist.save((err, savedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(savedRoom);
        };
    });

    return defer.promise;
}

MongoDB.findChatRoomById = function(id) {
    var defer = Q.defer();
    RoomModel.findOne({
        rid: id
    }).exec((err, findedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(findedRoom);
        };
    });
    return defer.promise;
}

MongoDB.closeRoom = function(id) {
    var defer = Q.defer();

    this.findChatRoomById(id).then(function(findedRoom) {
        if (findedRoom) {
            findedRoom.status.open = false;
            findedRoom.status.closeDate = new Date;
            findedRoom.save((err, savedRoom) => {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(savedRoom);
                };
            });
        };
    });

    return defer.promise;
}

MongoDB.isRoomLive = function(id) {
    var defer = Q.defer();
    RoomModel.findOne({
        rid: id,
        'status.open': true
    }).exec((err, findedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            if (findedRoom) {
                defer.resolve(true);
            } else {
                defer.resolve(false);
            }
        };
    });

    return defer.promise;
}

MongoDB.findAllLivesRoom = function(owner_pid) {
    var defer = Q.defer();
    var queryObject;
    if (owner_pid) {
        queryObject = {
            'owner.pid': owner_pid,
            'status.open': true
        };
    } else {
        queryObject = {
            'status.open': true
        };
    };
    
    RoomModel.find(queryObject).exec((err, findedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            if (findedRoom) {
                defer.resolve(findedRoom);
            } else {
                defer.resolve(null);
            }
        };
    });

    return defer.promise;
}

MongoDB.findAllRooms = function(owner_pid) {
    var defer = Q.defer();
    RoomModel.find({
        'owner.pid': owner_pid
    }).exec((err, findedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(findedRoom);
        }
    })
    return defer.promise;
}



module.exports = MongoDB;