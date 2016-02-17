(function(global) {


    'use strict';
    var main = angular.module('main', ['ui.bootstrap']);

    main.service('ShareDataService', function() {
        this.loginInstance = null;
        this.signUpInstance = null;
    });


    main.run(['$rootScope', function($rootScope) {
    	$rootScope.$on('CHANGE_LOGIN_NAME_REQUEST', function(even, message) {
    		$rootScope.$broadcast('CHANGE_LOGIN_NAME_RES', message);
    	})

        $rootScope.$on('RESET_SOCKET', function(message) {
            console.log('$rootScope called');
            $rootScope.$broadcast('RESET_SOCKET1');
        })
    }]);

    global.main_module = main;

})(this)