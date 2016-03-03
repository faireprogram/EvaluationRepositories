(function(global) {


    'use strict';
    var main_module = global.main_module;
    //private method

    //delete: logout, disconnect, 
    //add: login, register,  
    //session: get the order of name

    var _send_close_request = function($scope, data, sharedDataService) {
        if (data.status === 'ok') {
            sharedDataService.login = {
                pid: data.pid,
                username: data.username,
                verify: data.verify
            };
            $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', data);
            $scope.$emit('RESET_SOCKET_REQUEST', data);
            $scope.$emit('REFRESH_VISITOR_REQUEST', {
                op: 'add',
                username: data.username
            });
            global.localStorage.setItem('login', JSON.stringify(data));
        }
    }

    var loginCtrl = function($scope, $http, $uibModal, $rootScope, $stateParams, sharedDataService, $state) {

        $scope.$on('CHANGE_LOGIN_BUTTON_RES', function(ev, data) {
            $scope.login = data;
        });
        $scope.errormsg = {};
        console.log('$stateParams', $stateParams.roomId);

        $scope.openLogin = function() {

            var instance = sharedDataService.loginInstance = $uibModal.open({
                templateUrl: 'login/loginwindow.html',
                controller: 'LoginCtrl'
            });

            if (sharedDataService.signUpInstance) {
                sharedDataService.signUpInstance.dismiss();
            };

        };

        $scope.openSignup = function() {
            var instance = sharedDataService.signUpInstance = $uibModal.open({
                templateUrl: 'login/signup.html',
                controller: 'LoginCtrl'
            });

            if (sharedDataService.loginInstance) {
                sharedDataService.loginInstance.dismiss();
            };
        };

        $scope.register = function(user) {

            $http.post('/api/register', {
                'user': user
            }).success(function(data) {
                //if successful get the data
                //send the refresh visitor, refresh socket, username

                _send_close_request($scope, data, sharedDataService);

                if (data.status !== 'ok') {
                    // do nothing here
                } else {
                    sharedDataService.signUpInstance.close();
                };
            });
        }
        $scope.closeWindow = function() {
            if (sharedDataService.signUpInstance) {
                sharedDataService.signUpInstance.dismiss()
            };
            sharedDataService.loginInstance.dismiss();
        }

        $scope.login = function(user) {
            $http.post('/api/login', {user: user}).success(function(data) {
                //if successful get the data
                //send the refresh visitor, refresh socket, username

                _send_close_request($scope, data, sharedDataService);

                if (data.status !== 'ok') {
                    // do nothing here

                    $scope.errormsg=data.msg;
                    console.log(data.msg);
                    
                } else {
                    sharedDataService.loginInstance.close();
                };
            });
        };

        $scope.logOut = function() {
            $http.post('/api/loginout').success(function(data) {
                var operation = {
                    operate: 'delete',
                    username: data.username
                };

                $scope.login = {};
                $scope.$emit('RESET_SOCKET_REQUEST', {
                    logout: true
                });
                $scope.$emit('REFRESH_VISITOR_REQUEST', operation);
                $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', $scope.login);
                global.localStorage.setItem('login', JSON.stringify({}));
                sharedDataService.login = {};
                $state.go('index');
            });
        };

    };

    loginCtrl.$inject = ['$scope', '$http', '$uibModal', '$rootScope', '$stateParams', 'ShareDataService', '$state'];

    main_module.controller('LoginCtrl', loginCtrl);

})(this);