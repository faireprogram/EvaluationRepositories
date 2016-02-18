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

        var roomInstance = null;
        var currentObserver = null;

        //notify the client, I've successful connect to your device
        var session = socket.handshake.session ? socket.handshake.session : null;
        var username = session ? (session.user ? session.user.username : null) : null;
        socket.emit('connected', {
            username: username
        });

        console.log('re build connected', socket.client.id)

        // console.log('socket', socket.handshake.session);


        socket.on('registerOnChanel', function(data) {

            //data.roomId, create a room
            roomInstance = $injector.getInstance(data.roomId, C2SSubject, data.roomId);

            //client, create instance for the client
            currentObserver = $injector.getInstance(socket.client.id,
                C2SObserver,
                data.socketId ? data.socketId : socket.client.id, socket);

            roomInstance.attach(currentObserver);

            //add roomInstance to rooms
            subjectManagers.add(roomInstance);
            
            if(username) {
                roomInstance.addClient(username);
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


        socket.on('disconnect', function() {
            console.log('disconnect is called!!', socket.client.id);
            // if register with wrap the socket in observer,
            // then detach observer
            // else delete socket itself
            if(username) {
                var msg = {
                    from : username,
                    msgtype: 'MSG_GROUP',
                    to : 'rrr1',
                    op : 'delete',
                    type : 'visitor'
                };

                roomInstance.removeClient(username);
                roomInstance.dispatchMsg(msg);
            }

            if (currentObserver) {
                roomInstance.detach(currentObserver);
            } else {
                delete socket.nsp.sockets[socket.id];
            }

        })
    });

    return io;
}


module.exports = dispatch;