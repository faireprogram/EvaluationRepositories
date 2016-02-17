var AbstractSubject = require('./observer.js').AbstractSubject;
var AbstractObserver = require('./observer.js').AbstractObserver;

var C2SObserver = function(uuid_socket, socket) {
    AbstractObserver.call(this, uuid_socket, socket);

    this.update = function(msg) {
        //TODO 1) find the propriate socket in the redis
        //TODO 2) redircect message to the next socket
        console.log("Hello xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log("Hello", msg);

        if (msg.type == 'msg') {
            this.getSocket().emit('msg', {
                message: msg
            });
        }

        if (msg.type == 'visitor') {
            this.getSocket().emit('update_visitor', {
                message: msg
            });
        }



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

    //client side uuid;
    AbstractSubject.call(this, roomName);
}

C2SObserver.prototype = Object.create(AbstractObserver.prototype);
C2SSubject.prototype = Object.create(AbstractSubject.prototype);

C2SSubject.prototype.addClient = function(clientName) {
    var ind = -1;
    this.clients.forEach(function(client, i) {
        if(client === clientName) {
            ind = i;
        };
    });
    if(ind == -1) {
        this.clients.push(clientName);
    }
}

C2SSubject.prototype.removeClient = function(clientName) {
    var ind = -1;
    this.clients.forEach(function(client, i) {
        if(client === clientName) {
            ind = i;
        };
    });
    if(ind != -1) {
        this.clients.remove(ind);
    }
}

C2SObserver.prototype.contructor = C2SObserver;
C2SSubject.prototype.contructor = C2SSubject;

module.exports.C2SObserver = C2SObserver;
module.exports.C2SSubject = C2SSubject;