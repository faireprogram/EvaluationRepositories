require('./common.js');
var util = require('./util.js');
var $injector = require('./injector.js');


/* *
 *  AbstractObserver is abstract Class to provider default implementation
 * */

var AbstractObserver = function(uuid_socket, socketarg) {

    this.uuid = uuid_socket;
    this.socket = socketarg;

    this.update = function(msg) {
        //NEED TO BE DONE BY OBSERVER
    }

    this.getUUID_Socket = function() {
        return this.uuid;
    }

    this.getSocket = function() {
        return this.socket;
    }

    this.needUpdate = function(msg) {
        if (msg.msgtype === util.constant.MSG_GROUP) {
            // return util.string.in(this.uuid, msg.to.split(util.constant.DELIMITER_GROUP));
            return true;
        }
        if (msg.msgtype === util.constant.MSG_SINGLE) {
            return this.uuid === msg.to;
        }

    }
}

AbstractObserver.prototype.equal = function(obj) {
    if (!obj || !obj.getUUID_Socket || !obj.getUUID_Socket()) {
        return false;
    }

    return obj.getUUID_Socket() == this.getUUID_Socket();
}



////////////////////////////////////////////////
/**
 *  Subject
 * */
// MSGTYPE: server to server : {MSG_SEVER}
//          client to server : {MSG_SINGLE, MSG_GROUP}

// MsgContent: any string

var AbstractSubject = function(roomName) {
    this.roomName = roomName;
    this.observers = []; //default observer

    var state = {
        from: "",
        to: "",
        msgtype: "",
        msgcontent: ""
    };

    this.dispatchMsg = function(st) {
        if (!st) {
            console.log('Error with the state, couldnt pass null error message');
            return;
        }

        var validateState = function(st) {
            var validate = true;
            if (!st.msgtype) {
                console.log('Error with the state,  wrong msgtype!');
                validate = false;
            }
            if (!st.from) {
                console.log('Error with the state, wrong type with from!');
                validate = false;
            }
            if (!st.to) {
                console.log('Error with the state, wrong type with to!');
                validate = false;
            }
            return validate;
        }
        if (st.type === 'msg' && !validateState(st)) {
            return;
        }
        state = st;

        this.notifyAllObservers(st);
    }

    /**
     * we do not provider any Queue for state chavarnge,
     * which means if anything happens, we can't keep track of the history
     * */
    this.getState = function() {
        return state;
    }
}

AbstractSubject.prototype.find = function(observer) {
        var find = false;
        if(!!this.observers) {
            this.observers.forEach(function(item, index) {
                if(item.equal(observer)) {
                    find = true;
                };
            });
        }
        return find;
}

/**
 * attach the observers
 */
AbstractSubject.prototype.attach = function(observer) {
    if (!!this.observers && !this.find(observer)) {
        this.observers.push(observer);
    }
}

AbstractSubject.prototype.equal = function(obj) {
    if (!obj || !obj.roomName) {
        return false;
    }

    return obj.roomName == this.roomName;
}




/**
 * detach the observers
 **/
AbstractSubject.prototype.detach = function(observer) {
    if (!!this.observers) {
        var index = -1;
        this.observers.forEach(function(obj, i) {
            if (!!obj && obj.equal(observer)) {
                index = i;
            }
        });

        if (index != -1) {
            $injector.removeInstance(observer.getUUID_Socket());
            if(this.observers[index].socket) {
                delete this.observers[index].socket.nsp.sockets[this.observers[index].socket.id];
            }
            delete this.observers[index];
            this.observers.remove(index);
        }
    }
}

/**
 * notify all the observers
 */
AbstractSubject.prototype.notifyAllObservers = function(state) {
    this.observers = this.observers || [];

    /* encapsulate the */
    var _notifiable = function(observer, msg) {
        var notify = false;
        if (observer.update && typeof observer.update === 'function' && observer.needUpdate(msg)) {
            notify = true;
        }
        return notify;
    }

    for (var index in this.observers) {
        if (_notifiable(this.observers[index], state)) {
            this.observers[index].update(state);
        }
    }
}


module.exports.AbstractSubject = AbstractSubject;
module.exports.AbstractObserver = AbstractObserver;