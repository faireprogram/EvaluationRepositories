(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    // var msgs = [{
    //      from: 'wang',
    //      to: 'zhang',
    //      msg: 'HelloWorld!'
    //  }
    var ChatWindowCtrl = function($scope, $http, $rootScope, shareservice) {
        var socket0 = io.connect('http://localhost:8090');
        var ready = false;
        var username = null;

        global.socket0 = socket0;

        var _reset_socket = function() {
            socket0.on('connected', function(data) {
                socket0.emit('registerOnChanel', {
                    roomId: 'rrr1',
                    socketId: data.username
                });

                ready = true;
                username = data.username;
                if (username != null) {
                    var operation = {
                        operate: 'add',
                        username: username
                    };

                    $scope.$emit('REFRESH_VISITOR_REQUEST', operation);
                }

                socket0.on('msg', function(data) {
                    console.log(" wang received data", data);
                    $scope.msgs.push(data.message);
                    $scope.$digest();
                });
            });
        }

        _reset_socket();
        $scope.$on('RESET_SOCKET_RES', function(message) {
            console.log('xxxxxxxxxxxx');
            socket0.close();

            socket0 = io.connect('http://localhost:8090');
            _reset_socket();
        });



        $scope.sendMsg = function(content) {
            if (ready && username) {
                var msg = {
                    'msgtype': 'MSG_GROUP',
                    'from': username,
                    'to': 'rrr1',
                    'content': content
                }

                socket0.emit('msg', msg);
            }
        }

        global.socket0 = socket0;

        //msg {username: wang, msg : 'sss'}

        $scope.msgs = [];

        $scope.msg_position = function(msg) {
            if (msg.from === username) {
                return 'message me';
            } else {
                return 'message';
            }
        }
    }

    ChatWindowCtrl.$inject = ['$scope', '$http', '$rootScope', 'ShareDataService'];

    main_module.controller('ChatWindowCtrl', ChatWindowCtrl);

})(this);