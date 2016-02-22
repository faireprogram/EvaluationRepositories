(function(global) {


    'use strict';

    /* config array, add array method here*/
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    var defer = function() {
        if (defer.futurework) {
            defer.futurework();
        };
    };

    var deferStorageEvent = function(e) {
        if (e.key == 'login') {
            if (deferStorageEvent.futurework) {
                deferStorageEvent.futurework(JSON.parse(e.newValue));
            };
        }
    }

    var deferRoomLoad = function() {
        if (deferRoomLoad.futurework) {
            return deferRoomLoad.futurework();
        }
    }

    global.addEventListener('storage', function(e) {
        console.log('Storage is called!!!!1', e.newValue);
        deferStorageEvent(e);
    });

    var main = angular.module('main', ['ui.bootstrap', 'ui.router']);

    main.service('ShareDataService', function() {
        this.loginInstance = null;
        this.signUpInstance = null;
    });

    main.service('RoomService', ['$http', '$q', '$templateCache', 
        function($http, $q,  $templateCache) {
            this.isRoomExist = function(id) {
                var defer = $q.defer();
                $http.post('/api/roomExist', {
                    'rid': id
                }).success(function(status) {
                    defer.resolve(status);
                });
                return defer.promise;
            };

            this.getTempate = function(url) {
                return $http.get(url, {cache: $templateCache}).then(function(response) {
                    return response.data;
                });
            };
        }
    ]);

    main.config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('index', {
                    url: '/',
                    templateUrl: '/template/roomlists/roomlists.html'
                }).state('room', {
                    url: '/room/:roomId',
                    resolve: {
                        roomExist: function($stateParams, RoomService) {
                            return RoomService.isRoomExist($stateParams.roomId);
                        }
                    },
                    templateProvider: function($stateParams, RoomService, roomExist) {
                        if(roomExist.status) {
                            return RoomService.getTempate('/template/chatroom/room.html');
                        } else {
                            return RoomService.getTempate('/template/notfound/404.html');
                        }

                    },
                    // templateUrl: function($stateParams) {
                    //     return '/template/chatroom/room.html';
                    // },
                    onExit: function() {
                        console.log('ddddd');
                        // defer.resolve();
                        defer();
                    }
                }).state('statistics', {
                    url: '/statistics',
                    templateUrl: '/template/'
                }).state('roominfos', {
                    url: '/roominfos',
                    templateUrl: 'template/roominfos/roomInfos.html'
                });
        }
    ]);

    main.run(['$rootScope',
        function($rootScope) {

            $rootScope.$on('CHANGE_LOGIN_BUTTON_REQUEST', function(eve, data) {
                console.log('LOGIN BUTTON Request');
                $rootScope.$broadcast('CHANGE_LOGIN_BUTTON_RES', data);
            });

            $rootScope.$on('RESET_SOCKET_REQUEST', function(eve, message) {
                console.log('Rest Socket Request');
                $rootScope.$broadcast('RESET_SOCKET_RES', message);
            });

            $rootScope.$on('REFRESH_VISITOR_REQUEST', function(eve, message) {
                console.log('Refresh visitor RootScope');
                $rootScope.$broadcast('REFRESH_VISITOR_RES', message);
            });

            $rootScope.$on('UPDATE_VISITOR_REQUEST', function(eve, m) {
                console.log('Update visitor RootScope');
                if (m.type === 'update_visitor') {
                    $rootScope.$broadcast('UPDATE_VISITOR_RES', {
                        operate: m.message.op,
                        username: m.message.from
                    });
                }

                if (m.type === 'init_visitor') {
                    $rootScope.$broadcast('UPDATE_VISITOR_RES', {
                        operate: 'init',
                        username: m
                    });
                }

            });

            $rootScope.$on('CHANGE_LOGIN_NAME_REQUEST', function(even, message) {
                console.log('CHANGE_LOGIN_NAME_REQUEST');
                $rootScope.$broadcast('CHANGE_LOGIN_NAME_RES', message);
            });

            $rootScope.$on('UPDATE_OBSERVER_NAME_REQUEST', function(eve, message) {
                console.log('UPDATE_OBSERVER_NAME_REQUEST');
                $rootScope.$broadcast('UPDATE_OBSERVER_NAME_RES', message);
            });

            // defer work in the function
            defer.futurework = function() {
                console.log('hhhhhhhhhh');
                $rootScope.$broadcast('CLOSE_SOCKET_RES');
            };

            deferStorageEvent.futurework = function(data) {
                $rootScope.$broadcast('CHANGE_LOGIN_NAME_RES', data);
            };

            deferRoomLoad.futurework = function() {
                console.log('I\'m running ');
            }
        }
    ]);

    global.main_module = main;

})(this)
