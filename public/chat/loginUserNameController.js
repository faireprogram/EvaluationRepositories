(function(global) {


    'use strict';
    var main_module = global.main_module;

    var _assign_login = function(data) {
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
        return login;
    }

    var loginUserNameController = function($scope, $http) {
        $http.post('/api/login').success(function(data) {
            $scope.$emit('CHANGE_LOGIN_NAME_REQUEST', data);
        });

        $scope.$on('CHANGE_LOGIN_NAME_RES', function(even, data) {
            $scope.login = _assign_login(data);
            $scope.$emit('CHANGE_LOGIN_BUTTON_REQUEST', $scope.login);
        });
    }

    loginUserNameController.$inject = ['$scope', '$http'];

    main_module.controller('loginUserNameCtrl', loginUserNameController);

})(this);