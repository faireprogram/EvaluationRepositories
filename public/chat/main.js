(function(global) {


    'use strict';

    /* config array, add array method here*/
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    var defer = function() {
        if(defer.futurework) {
            defer.futurework();
        };
    };

    var main = angular.module('main', ['ui.bootstrap', 'ui.router']);

    main.service('ShareDataService', function() {
        this.loginInstance = null;
        this.signUpInstance = null;
    });

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
                    templateUrl: '/template/room/room.html',
                    onExit: function() {
                        console.log('ddddd');
                        // defer.resolve();
                        defer();
                    }
                }).state('statistics', {
                    url: '/statistics',
                    templateUrl: '/template/'
                });
        }
    ]);

    main.run(['$rootScope',
        function($rootScope) {

            $rootScope.$on('CHANGE_LOGIN_BUTTON_REQUEST', function(eve, data) {
                console.log('LOGIN BUTTON Request');
                $rootScope.$broadcast('CHANGE_LOGIN_BUTTON_RES', data);
            });

            $rootScope.$on('RESET_SOCKET_REQUEST', function(message) {
                console.log('Rest Socket Request');
                $rootScope.$broadcast('RESET_SOCKET_RES');
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
            })

            defer.futurework = function() {
                console.log('hhhhhhhhhh');
                $rootScope.$broadcast('CLOSE_SOCKET_RES');
            }
        }
    ]);

    global.main_module = main;

})(this)