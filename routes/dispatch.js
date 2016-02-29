var $injector = require('../util/injector.js');
var C2SObserver = require('../util/c2sobserver.js').C2SObserver;
var C2SSubject = require('../util/c2sobserver.js').C2SSubject;
var SubjectManagers = require('../util/subjectmanagers.js');
var util = require('../util/util.js');
var mongodbAPI = require('../db/mongodb.js');




var dispatch = function(server) {
    var io = require('socket.io')(server);

    /**
     * if C2SSubjectManage not exist, create a new one for him!
     */
    var subjectManagers = null;
    if (!$injector.statics.SubjectManagers) {
        subjectManagers = $injector.statics.SubjectManagers = $injector.getInstance(util.string.uuid(), SubjectManagers);
    };

    /**
     * connection socket
     **/
    io.on('connection', function(socket) {
        var roomId;
        var roomInstance = null;
        var currentObserver = null;

        //notify the client, I've successful connect to your device
        var session = socket.handshake.session ? socket.handshake.session : null;
        var username = session ? (session.user ? session.user.username : null) : null;
        var pid = session ? (session.user ? session.user.pid : null) : null;
        socket.emit('connected', {
            username: username,
            pid: pid
        });

        console.log('re build connected', socket.client.id)

        // console.log('socket', socket.handshake.session);


        socket.on('registerOnChanel', function(data) {
            roomId = data.roomId;

            //data.roomId, create a room
            roomInstance = $injector.getInstance(roomId, C2SSubject, roomId);

            //client, create instance for the client
            currentObserver = $injector.getInstance(socket.client.id,
                C2SObserver,
                socket.client.id, socket, data.socketId);

            roomInstance.attach(currentObserver);

            //add roomInstance to rooms
            subjectManagers.add(roomInstance);

            if (username) {
                roomInstance.addClient({
                    username: username,
                    pid: pid
                });
            };

            socket.emit('init_visitor', roomInstance.clients);
        });

        // receive the msg from the client
        socket.on('msg', function(msg) {
            //dispatch Msg, save the msgs to DB
            util.fn.defer(() => {
                mongodbAPI.logchat(msg).then(function() {
                    console.log('successful save the history!');
                });
            });

            msg.type = 'msg';
            roomInstance.dispatchMsg(msg);
            roomInstance.pushMsg(msg);
        });

        socket.on('visitor', function(msg) {
            //dispatch Msg, save the msgs to DB
            msg.type = 'visitor';
            roomInstance.dispatchMsg(msg);
        });

        socket.on('update_observer', function(msg) {
            //dispatch Msg, save the msgs to DB
            username = msg.from;
            if (roomInstance) {
                msg.type = 'update_observer';
                roomInstance.dispatchMsg(msg);
            }
        });

        var maintain = function(msg) {
            console.log('logout  ', msg);
            if (username) {
                var default_msg = {
                    from: username,
                    msgtype: 'MSG_GROUP',
                    to: roomId,
                    op: 'delete',
                    type: 'visitor',
                    logout: msg.logout || false
                };
                console.log('roomInstance.count(username)', roomInstance.count(username));
                //if it's logout, delete all the msgs
                // otherwise judge all the socket in the room whether has been closed

                if (roomInstance.count(username) == 1) {
                    roomInstance.removeClient({
                        username: username,
                        pid: pid
                    });
                    roomInstance.dispatchMsg(default_msg);
                };

                if (default_msg.logout) {
                    roomInstance.removeClient(username);
                    subjectManagers.dispatchMsg(default_msg);
                }

            };
        };

        socket.on('logout', function(msg) {
            maintain(msg);
        });

        socket.on('disconnect', function() {
            console.log('disconnect is called!!', socket.client.id);
            // if register with wrap the socket in observer,
            // then detach observer
            // else delete socket itself
            maintain({});

            if (currentObserver) {
                roomInstance.detach(currentObserver);
            }
            if (roomInstance) {
                console.log('roomInstance', roomInstance);

            };
            if (roomInstance.observers[0]) {
                console.log('after delete socket', roomInstance.observers[0].socket.nsp.sockets);
            }
        });

    });

    return io;
}


module.exports = dispatch;