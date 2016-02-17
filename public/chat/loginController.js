(function(global) {


    'use strict';
    var main_module = global.main_module;
    //private method
    var _assign_login = function($scope, data) {
        var login;
        if (data.status === 'ok') {
            login = {
                status: data.status,
                username: data.username
            }
        } else {
            login = {
                status: data.status,
                errmsg: data.msg
            }
        }
        $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', login);
    }

    var loginCtrl = function($scope, $http, $uibModal, $rootScope, sharedDataService) {
        $http.post('/api/login').success(function(data) {
           _assign_login($scope, data);
        })

        $scope.$on('CHANGE_LOGIN_NAME_RES', function(even, data) {
            $scope.login = data;
        });


        $scope.openLogin = function() {
            var instance = sharedDataService.loginInstance = $uibModal.open({
                templateUrl: 'login/loginwindow.html',
                controller: 'LoginCtrl'
            });

            if(sharedDataService.signUpInstance) {
                sharedDataService.signUpInstance.close();
            };

            instance.result.then(function(data) {
                if(!data) return;
                $scope.$emit('RESET_SOCKET');
            	_assign_login($scope, data);
            });
        };

        $scope.openSignup = function() {
            var instance = sharedDataService.signUpInstance = $uibModal.open({
                templateUrl: 'login/signup.html',
                controller: 'LoginCtrl'
            });

            if(sharedDataService.loginInstance) {
                sharedDataService.loginInstance.close();
            };

            instance.result.then(function(data) {
                if(!data) return;
                _assign_login($scope, data);
                $scope.$emit('RESET_SOCKET');
            });
        }

        $scope.logOut = function() {
        	 $http.post('/api/loginout').success(function(data) {
        	 	$scope.login = {};
                $scope.$emit('RESET_SOCKET');
        	 });
        }

        $scope.register = function(user) {
            $http.post('/api/register', {
                'user': user
            }).success(function(data) {
                if (data.status !== 'ok') {
                	_assign_login($scope, data);

                } else {
                    _assign_login($scope, data);
                    sharedDataService.signUpInstance.close(data);
                };
            });
        }

        $scope.login = function(user) {
            $scope.$emit('RESET_SOCKET');
        };
    };

    loginCtrl.$inject = ['$scope', '$http', '$uibModal', '$rootScope', 'ShareDataService'];

    main_module.controller('LoginCtrl', loginCtrl);

})(this);