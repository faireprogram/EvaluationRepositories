(function(global) {


    'use strict';
    var main_module = global.main_module;
    //private method

    //delete: logout, disconnect, 
    //add: login, register,  
    //session: get the order of name

    var _send_close_request = function($scope, data) {
        if (data.status === 'ok') {
            $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', data);
            $scope.$emit('RESET_SOCKET_REQUEST', data);
            $scope.$emit('REFRESH_VISITOR_REQUEST', {op: 'add', username: data.username});
        }
    }

    var loginCtrl = function($scope, $http, $uibModal, $rootScope, sharedDataService) {

        $scope.$on('CHANGE_LOGIN_BUTTON_RES', function(ev, data) {
            $scope.login = data;
        })

        $scope.openLogin = function() {

            var instance = sharedDataService.loginInstance = $uibModal.open({
                templateUrl: 'login/loginwindow.html',
                controller: 'LoginCtrl'
            });

            if (sharedDataService.signUpInstance) {
                sharedDataService.signUpInstance.close();
            };

        };

        $scope.openSignup = function() {
            var instance = sharedDataService.signUpInstance = $uibModal.open({
                templateUrl: 'login/signup.html',
                controller: 'LoginCtrl'
            });

            if (sharedDataService.loginInstance) {
                sharedDataService.loginInstance.close();
            };
        };

        $scope.register = function(user) {

            $http.post('/api/register', {
                'user': user
            }).success(function(data) {
                //if successful get the data
                //send the refresh visitor, refresh socket, username

                _send_close_request($scope, data);

                if (data.status !== 'ok') {
                    // do nothing here
                } else {
                    sharedDataService.signUpInstance.close();
                };
            });
        }

        $scope.login = function(user) {
            $scope.$emit('RESET_SOCKET_REQUEST');
            $scope.$emit('REFRESH_VISITOR_REQUEST');
        }

        $scope.logOut = function() {
            $http.post('/api/loginout').success(function(data) {
                var operation = {
                    operate: 'delete',
                    username: data.username
                };

                $scope.login = {};
                $scope.$emit('RESET_SOCKET_REQUEST');
                $scope.$emit('REFRESH_VISITOR_REQUEST', operation);
                $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', $scope.login);
            });
        };

    };

    loginCtrl.$inject = ['$scope', '$http', '$uibModal', '$rootScope', 'ShareDataService'];

    main_module.controller('LoginCtrl', loginCtrl);

})(this);