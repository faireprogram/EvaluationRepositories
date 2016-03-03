var moment = require('moment');

var HistoryModel = require('../model/History.js');
var ProfileModel = require('../model/Profile.js');
var RoomModel = require('../model/Room.js');
var mail = require('../email/mail.js');
var util = require('../util/util.js');

var Code = require('mongodb').Code;

var Q = require('q');


var MongoDB = {};
///////////////////////////////////////////////////////////////////////
///  Login Part
///////////////////////////////////////////////////////////////////////

//  user.input => {user.username, or user.email}, user.password
MongoDB.checklogin = function(user) {
    console.log('user', user);
    var defer = Q.defer();
    ProfileModel.authenticate()(user.username, user.password, (err, status, failedreason) => {
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

MongoDB.findUserByPID = function(pid) {
    var defer = Q.defer();
    ProfileModel.findOne({
        'pid': pid
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

    var _default_img = util.constant.DEFAULT_PROFILE_IMG;


    var _default_user = new ProfileModel({
        pid: user.pid || util.string.uuid(8),
        username: user.username,
        email: user.email,
        gender: 'm',
        birthDay: new Date(1970,01,01),
        verify: _default_verify,
        level: _default_level,
        balance: _default_balance,
        profileImg: _default_img
    });

    // try to find by Email or UserName
    // if not found ,then create
    // else gives a error
    this.findUserByEmailOrUserName(user).then(() => {
        //_default_user
        defer.reject(util.constant.ERROR_EXISTING_ACCOUNT);
    }, () => {
        ProfileModel.register(_default_user, user.password, (err, user) => {
            util.fn.defer(() => {
                mail.sendMail(user.email, 'http://localhost:8090/api/active/' + user.verify.code);
            });

            if (!!err) {
                defer.reject(err);
            } else {
                defer.resolve(user);
            }
        });
    });

    return defer.promise;
}

MongoDB.activateByParams = function(code) {
    var defer = Q.defer();
    var query = {
        'verify.code': code
    };
    ProfileModel.findOne(query).exec(function(err, person) {
        //IF the person is find, and the status is false, then
        //try to set its status 
        if (person && !person.verify.status) {
            ProfileModel.update(query, {
                $set: {
                    'verify.status': true
                }
            }, {
                multi: true
            }, function(err, numAffected) {
                var newQuery =  {
                    pid: person.pid
                };
                ProfileModel.findOne(newQuery).exec(function(err, updatedPerson) {
                    defer.resolve([updatedPerson, numAffected.n]);
                });
            });
        } else {
            defer.resolve(0);
        };
    });

    return defer.promise;
}

MongoDB.changeImg = function(pid, img) {
    var defer = Q.defer();
    this.findUserByPID(pid).then(function(user) {
        if(user) {
            user.profileImg = img;
            user.save(function(err, successfulObj) {
                if(err) {
                    defer.reject(err);
                } else {
                    defer.resolve(true);
                };
            });
        };

    }).catch(function(err) {
        defer.reject(err);
    });
    
    return defer.promise;
}

MongoDB.saveProfileChanges = function(user) {
    var defer = Q.defer();
    this.findUserByPID(user.pid).then(function(userFind) {
        if(user) {
            userFind.birthDay = new Date(user.birthDay);
            userFind.gender = user.gender;
            userFind.email = user.email;
            userFind.save(function(err, successfulObj) {
                if(err) {
                    defer.reject(err);
                } else {
                    defer.resolve(successfulObj);
                };
            });
        };

    }).catch(function(err) {
        defer.reject(err);
    });
    
    return defer.promise;
}

MongoDB.findImg = function(pid) {
    var defer = Q.defer();
    this.findUserByPID(pid).then(function(user) {
        if(user) {
            defer.resolve(user.profileImg);
        } else {
            defer.resolve({});
        };
    }).catch(function(err) {
        defer.reject(err);
    });
    return defer.promise;
}

MongoDB.updateRoomstatus = function(rid, status) {
    var defer = Q.defer();
    
    this.findChatRoomById(rid).then(function(findedRoom) {
        console.log(findedRoom);
        if(findedRoom) {
            findedRoom.status.open = status;
            if(status) {
                findedRoom.status.closeDate = null;
            }else{
                findedRoom.status.closeDate = new Date();
            }
            findedRoom.save(function(err, successfulObj) {
                if(err) {
                    defer.reject(err);
                } else {
                    defer.resolve(successfulObj);
                }
            });
        };

    }).catch(function(err) {
        defer.reject(err);
    });
    return defer.promise;
}

///////////////////////////////////////////////////////////////////////
///  Chat History Part
///////////////////////////////////////////////////////////////////////

MongoDB.aggregateDateByUserId = function(rid, dateRange, keyfn) {
    var defer = Q.defer();
    // if there's no date range, then use the default DateRange
    var _default_dateRange;

    var _default_kef;

    if (!dateRange) {
        var now = moment(new Date());
        // var lastSunday = now.day('0').hour(23).minutes(59).seconds(59).format();
        // var nextMonday = now.day('8').day(8).hour(0).minutes(0).seconds(0).format()
        var lastSunday = moment().startOf('week').format();
        var nextSunday = moment().endOf('week').format();
        _default_dateRange = {
            '$gte': new Date(lastSunday),
            '$lte': new Date(nextSunday)
        };
    };

    if (!keyfn) {
        _default_kef = function(doc) {
            var d = new Date(doc.date);
            return {
                key: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
                rid: doc.hid,
                year: d.getFullYear(),
                month: (d.getMonth() + 1),
                date: d.getDate()
            };
        };
    };

    _default_dateRange = dateRange || _default_dateRange;
    _default_kef = keyfn || _default_kef;

    var group = {
        keyf: _default_kef,
        condition: {
            hid: rid,
            date: _default_dateRange
        },
        initial: {
            count: 0
        },
        reduce: new Code(function(curr, result) {
            result.count++;
        }),
        finalize: function(result) {},
        command: true,
        option: {},
        callback: function(err, results) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(results);
            }
        }
    }

    // HistoryModel.match(date : {'$gt' : new Date(lastSunday)}).group()
    //kef, cond, reduce, finialize, 
    var groupPromise = HistoryModel.collection.group(group.keyf,
        group.condition,
        group.initial,
        group.reduce,
        group.finalize,
        group.command,
        group.option,
        group.callback);

    return defer.promise;
}

MongoDB.aggregateMonthDateById = function(rid, year, keyfn) {
    var lastYear = moment({
        y: year - 1,
        M: 11,
        d: 31,
        h: 23,
        m: 59,
        s: 59
    });

    var nextYear = moment({
        y: year + 1,
        M: 0,
        d: 1,
        h: 0,
        m: 0,
        s: 0
    });

    var dateRange = {
        '$gt': new Date(lastYear.format()),
        '$lt': new Date(nextYear.format())
    };

    var default_keyfn = function(doc) {
        var d = new Date(doc.date);
        return {
            key: d.getFullYear() + '-' + (d.getMonth() + 1),
            rid: doc.hid,
            month: d.getMonth() + 1,
            year: d.getFullYear()
        };
    };

    default_keyfn = keyfn || default_keyfn;

    return this.aggregateDateByUserId(rid, dateRange, default_keyfn);
}

MongoDB.aggregateCurrentWeek = function(rid) {
    return this.aggregateDateByUserId(rid);
}

MongoDB.aggregateCurrentWeekTotal = function(rid) {
    var keyf = function(doc) {
        var d = new Date(doc.date);
        return {
            key: doc.hid,
            rid: doc.hid,
        };
    };
    return this.aggregateDateByUserId(rid, null, keyf);
}

MongoDB.aggregateMonthTotal = function(rid, year) {
    var keyf = function(doc) {
        var d = new Date(doc.date);
        return {
            key: doc.hid,
            rid: doc.hid,
            year: d.getFullYear()
        };
    };
    return this.aggregateMonthDateById(rid, year, keyf);
}

MongoDB.groupDefaultByUser = function(pid, year, fn) {
    var defer = Q.defer();
    var self = this;

    this.findAllRooms(pid).then(function(rooms) {
        var promises = [];
        rooms.forEach(function(room) {
            promises.push(fn.call(self, room.rid, year));
        });

        Q.all(promises).then(function(results) {
            var finalResult = [];
            results.forEach(function(result) {
                finalResult = finalResult.concat(result);
            });
            defer.resolve(finalResult);
        }).catch(function(err) {
            defer.reject(err);
        });
    });

    return defer.promise;
};

MongoDB.groupMonthByUser = function(pid, year) {
    return this.groupDefaultByUser(pid, year, this.aggregateMonthDateById);
};

MongoDB.groupWeekByUser = function(pid) {
    return this.groupDefaultByUser(pid, null, this.aggregateCurrentWeek);
};

MongoDB.groupMonthTotalByUser = function(pid, year) {
    return this.groupDefaultByUser(pid, year, this.aggregateMonthTotal);
};

MongoDB.groupWeekTotalByUser = function(pid) {
    return this.groupDefaultByUser(pid, null, this.aggregateCurrentWeekTotal);
};


MongoDB.logchat = function(msg) {
    var _get_chatid = function() {
        if (msg.msgtype === util.constant.MSG_SINGLE) {
            return msg.from > msg.to ? msg.from + msg.to : msg.to + msg.from;
        }

        if (msg.msgtype === util.constant.MSG_GROUP) {
            return msg.to;
        }
    }

    var defer = Q.defer();

    var _default_history_msg = {
        hid: _get_chatid(msg),
        from: msg.from,
        to: msg.to,
        msgtype: msg.msgtype,
        content: msg.content,
        date: msg.date || new Date()
    }

    var historyModel = new HistoryModel(_default_history_msg);
    historyModel.save((err, saveObj) => {
        if (err) {
            defer.reject(err);
            return;
        };
        defer.resolve(saveObj);
    });

    return defer.promise;
}

///////////////////////////////////////////////////////////////////////
///  ChatRooms Part
///////////////////////////////////////////////////////////////////////

MongoDB.createChatRoom = function(chatRoom) {
    var defer = Q.defer();
    var _default_chatRoom = {
        rid: chatRoom.rid || util.string.num_uuid(3),
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

MongoDB.findAllLivesRoom = function(owner_pid, pagination) {
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

    //pagination
    var pros = RoomModel.find(queryObject);

    if (pagination && util.num.isNum(pagination.currentRecords) && util.num.isNum(pagination.maxPer)) {
        pros = pros.skip(pagination.currentRecords).limit(pagination.maxPer);
    }

    pros.exec((err, findedRoom) => {
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

MongoDB.findRoomByMulitpleConditons = function(search, pagination) {
    var defer = Q.defer();

    var andQuery = [];
    var orQuery = [];
    if (!search) {
        search = {};
    }

    if (search.name) {
        // owner.username
        orQuery.push({
            'rid': {
                $regex: new RegExp(search.name),
                $options: 'i'
            },
            'status.open': true
        });

        // // roomName
        orQuery.push({
            'roomName': {
                $regex: new RegExp(search.name),
                $options: 'i'
            },
            'status.open': true
        });

        var or = {
            $or: orQuery
        };
        andQuery.push(or);
    };

    // tags []
    if (search.tag) {
        andQuery.push({
            'tags': {
                $in: [new RegExp(search.tag, 'i')]
            },
            'status.open': true
        });
    };

    // if (!search || (!search.name && !search.tag)) {
    //     defer.resolve(null);
    // } else {
    var pros;
    if (andQuery.length) {
        pros = RoomModel.find({
            $and: andQuery
        });
    } else {
        pros = RoomModel.find({});
    }

    if (pagination && util.num.isNum(pagination.currentRecords) && util.num.isNum(pagination.maxPer)) {
        pros = pros.skip(pagination.currentRecords).limit(pagination.maxPer);
    }
    pros.exec((err, findedRoom) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(findedRoom);
        }
    });
    // }

    return defer.promise;
}

module.exports = MongoDB;