var AbstractSubject = require('./observer.js').AbstractSubject;
var AbstractObserver = require('./observer.js').AbstractObserver;

var C2SObserver = function(uuid_socket, socket, observerName) {
    AbstractObserver.call(this, uuid_socket, socket, observerName);

    this.update = function(msg) {
        //TODO 1) find the propriate socket in the redis
        //TODO 2) redircect message to the next socket

        if (msg.type == 'msg') {
            this.getSocket().emit('msg', {
                message: msg
            });
        };

        if (msg.type == 'visitor') {
            this.getSocket().emit('update_visitor', {
                message: msg
            });
        };

        if(msg.type == 'update_observer') {
            if(this.uuid === msg.socketId) {
                this.observerName = msg.from || '__$visitor';
            };
        };

        //MSG_SINGLE, 
        // find the socket ID in the redis,
        // send message to other socket




        //MSG_GROUP, 
        // find the socket ID in the redis,
        // send message to other socket

        //broadcast();
    }
}

/**
 * when a client login in,
 * firstly, create a observer for him, add the observer in the subject center
 *
 **/
var C2SSubject = function(roomName) {
    this.clients = [];
    this.lastestMsgs = [];

    //client side uuid;
    AbstractSubject.call(this, roomName);
}

C2SObserver.prototype = Object.create(AbstractObserver.prototype);
C2SSubject.prototype = Object.create(AbstractSubject.prototype);

C2SSubject.prototype.addClient = function(clientName) {
    var ind = -1;
    this.clients.forEach(function(client, i) {
        if (client === clientName) {
            ind = i;
        };
    });
    if (ind == -1) {
        this.clients.push(clientName);
    }
}

C2SSubject.prototype.removeClient = function(clientName) {
    var ind = -1;
    this.clients.forEach(function(client, i) {
        if (client === clientName) {
            ind = i;
        };
    });
    if (ind != -1) {
        this.clients.remove(ind);
    }
}

C2SSubject.prototype.pushMsg = function(msg) {
    if (this.lastestMsgs.length > 6) {
        this.lastestMsgs.remove(0);
    }
    this.lastestMsgs.push(msg);
}

C2SObserver.prototype.contructor = C2SObserver;
C2SSubject.prototype.contructor = C2SSubject;

module.exports.C2SObserver = C2SObserver;
module.exports.C2SSubject = C2SSubject;