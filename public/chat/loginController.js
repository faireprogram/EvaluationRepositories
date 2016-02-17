(function(global) {


    'use strict';
    var main_module = global.main_module;
    //private method
    var _assign_login = function($scope, data) {
        if (data.status === 'ok') {
            $scope.login = {
                status: data.status,
                username: data.username
            }
        } else {
            $scope.login = {
                status: data.status,
                errmsg: data.msg
            }
        }
    }

    var loginCtrl = function($scope, $http, $uibModal, $rootScope, sharedDataService) {
        $http.post('/api/login').success(function(data) {
            _assign_login($scope, data);
        })


        $scope.openLogin = function() {
            var instance = sharedDataService.loginInstance = $uibModal.open({
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            });

            instance.result.then(function(data) {
                var operation = {
                    operate: 'add',

                }
                _assign_login($scope, data);
                $scope.$emit('RESET_SOCKET_REQUEST');
                $scope.$emit('REFRESH_VISITOR_REQUEST');
            })
        }

        $scope.logOut = function() {
            $http.post('/api/loginout').success(function(data) {
                var operation = {
                     operate: 'delete',
                     username : data.username
                };

                $scope.login = {};
                $scope.$emit('RESET_SOCKET_REQUEST');
                $scope.$emit('REFRESH_VISITOR_REQUEST', operation);
            });
        }

        $scope.register = function(user) {

            $http.post('/api/register', {
                'user': user
            }).success(function(data) {
                if (data.status !== 'ok') {
                    _assign_login($scope, data);

                } else {
                    sharedDataService.loginInstance.close(data);
                }
            });
        }

        $scope.login = function(user) {
            $scope.$emit('RESET_SOCKET_REQUEST');
            $scope.$emit('REFRESH_VISITOR_REQUEST');
        }
    };

    loginCtrl.$inject = ['$scope', '$http', '$uibModal', '$rootScope', 'ShareDataService'];

    main_module.controller('LoginCtrl', loginCtrl);

})(this);