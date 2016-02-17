(function(global) {


    'use strict';
    var main = angular.module('main', ['ui.bootstrap']);

    main.service('ShareDataService', function() {
        this.loginInstance = null;
    });

    main.config(function() {
        /* config array, add array method here*/
        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    });

    main.run(['$rootScope',
        function($rootScope) {

            $rootScope.$on('RESET_SOCKET_REQUEST', function(message) {
                console.log('Rest Socket Request');
                $rootScope.$broadcast('RESET_SOCKET_RES');
            });

            $rootScope.$on('REFRESH_VISITOR_REQUEST', function(eve, message) {
                console.log('Refresh visitor RootScope');
                $rootScope.$broadcast('REFRESH_VISITOR_RES', message);
            });
        }
    ]);

    global.main_module = main;

})(this)