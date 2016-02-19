(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    // var msgs = [{
    //      from: 'wang',
    //      to: 'zhang',
    //      msg: 'HelloWorld!'
    //  }
    var ChatWindowCtrl = function($scope, $http, $rootScope, $stateParams, shareservice) {
        var socket0 = io.connect('http://localhost:8090');
        var ready = false;
        var username = null;

        global.$stateParams = $stateParams;

        global.socket0 = socket0;

        var _reset_socket = function() {
            socket0.on('connected', function(data) {
                socket0.emit('registerOnChanel', {
                    roomId: $stateParams.roomId,
                    socketId: data.username
                });

                ready = true;
                username = data.username;
                if (username != null) {
                    var operation = {
                        operate: 'add',
                        username: username
                    };

                    var msg = {
                        'msgtype': 'MSG_GROUP',
                        'from': username,
                        'to': $stateParams.roomId,
                        'op': 'add'
                    }

                    socket0.emit('visitor', msg);
                }

                socket0.on('msg', function(data) {
                    console.log(" wang received data", data);
                    $scope.msgs.push(data.message);
                    $scope.$digest();
                });

                // $scope.$on('REFRESH_VISITOR_RES', function(ev, data) {
                //     socket0.emit('visitor', {roomId: 'rrr1', data: data});
                // })

                socket0.on('init_visitor', function(data) {
                    data.type = 'init_visitor';
                    $scope.$emit('UPDATE_VISITOR_REQUEST', data);
                    $scope.$apply();
                });

                socket0.on('update_visitor', function(data) {
                    data.type = 'update_visitor';
                    $scope.$emit('UPDATE_VISITOR_REQUEST', data);
                    $scope.$apply();
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

        $scope.$on('CLOSE_SOCKET_RES', function() {
            socket0.close();
        });

        $scope.sendMsg = function(content) {
            if (ready && username) {
                var msg = {
                    'msgtype': 'MSG_GROUP',
                    'from': username,
                    'to': $stateParams.roomId,
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

    ChatWindowCtrl.$inject = ['$scope', '$http', '$rootScope', 
        '$stateParams', 'ShareDataService'];

    main_module.controller('ChatWindowCtrl', ChatWindowCtrl);

})(this);