(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    // var msgs = [{
    //      from: 'wang',
    //      to: 'zhang',
    //      msg: 'HelloWorld!'
    //  }
    var ChatWindowCtrl = function($scope, $http, $rootScope, $stateParams, shareservice, noticeMessage) {
        var socket0 = io.connect('http://192.168.191.1:8090');
        var ready = false;
        var username = null;
        var pid = null;

        global.$stateParams = $stateParams;

        global.socket0 = socket0;

        var _reset_socket = function() {
            socket0.on('connected', function(data) {
                $scope.id = socket0.id;
                $scope.$apply();

                socket0.emit('registerOnChanel', {
                    roomId: $stateParams.roomId,
                    socketId: data.username
                });

                ready = true;
                username = data.username;
                pid = data.pid;
                if (username != null) {
                    var operation = {
                        operate: 'add',
                        username: username
                    };

                    var msg = {
                        'msgtype': 'MSG_GROUP',
                        'from': username,
                        'to': $stateParams.roomId,
                        'op': 'add',
                        'pid': pid
                    }

                    socket0.emit('visitor', msg);
                }

                socket0.on('msg', function(data) {
                    console.log(" wang received data", data);
                    $scope.msgs.push(data.message);
                    $scope.$digest();
                    $( "#msgContainer" ).scrollTop($( "#msgContainer" )[0].scrollHeight);
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
        $scope.$on('RESET_SOCKET_RES', function(evt, message) {
            console.log('close the socket of client');
            if (message.logout) {
                socket0.emit('logout', {
                    logout: message.logout
                });
            }

            socket0.close();

            socket0 = io.connect('http://192.168.191.1:8090');
            _reset_socket();
        });

        $scope.$on('CLOSE_SOCKET_RES', function() {
            socket0.close();
        });

        $scope.$on('UPDATE_OBSERVER_NAME_RES', function(evt, username) {
            var msg = {
                'msgtype': 'MSG_GROUP',
                'from': username,
                'to': $stateParams.roomId,
                'socketId': socket0.id
            };

            socket0.emit('update_observer', msg);
        });

        $scope.sendMsg = function(content) {

        
            if (!!content) {
                if (!shareservice.login.username) {
                    noticeMessage.error('Should Login First, then have the permission to send msg');
                    return;
                }
                if (!shareservice.login.verify) {
                    noticeMessage.error('Should Active first Before You can send Message');
                    return;
                }
                if (ready && username) {

                    var msg = {
                        'msgtype': 'MSG_GROUP',
                        'from': username,
                        'to': $stateParams.roomId,
                        'content': content,
                        'pid': pid
                    };

                    socket0.emit('msg', msg);
                    $scope.inputMsg = '';
                    $('#msgAreadID').focus();
                }
              

            } else {
                noticeMessage.warn('Please type something!');
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


        //////Mojo Expression
        $scope.mogs = {
            1: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            2: [10, 11, 12, 13, 14, 15, 16, 17, 18],
            3: [19, 20, 21, 22, 23, 24, 25, 26, 27]
        };

        $scope.selectMojo = function(num) {
            $scope.inputMsg = ($scope.inputMsg || '') + '[#' + num + ']';
            $('#msgAreadID').focus();
        };

        $scope.toggle = function(show) {
            $scope.mojoShow = show;
            $('#msgAreadID').focus();
        };

        $scope.closeMojo = function(eve) {
            $scope.mojoShow = false;
        };

    }

    ChatWindowCtrl.$inject = ['$scope', '$http', '$rootScope',
        '$stateParams', 'ShareDataService', 'NoticeMessage'
    ];

    main_module.controller('ChatWindowCtrl', ChatWindowCtrl);

})(this);