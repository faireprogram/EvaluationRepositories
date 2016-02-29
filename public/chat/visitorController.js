(function(global) {


    'use strict';
    var main_module = global.main_module;

    var _find = function(arr, username, callback) {
        var ind = -1;
        arr.forEach(function(visitor, index) {
            if (visitor.username === username) {
                ind = index;
            }
        });
        if (ind != -1) {
            callback(arr[ind], ind);
        }
        return ind;
    }

    var visitorController = function($scope) {
        $scope.visitors = [];

        $scope.$on('UPDATE_VISITOR_RES', function(eve, operation) {
            if (operation.operate === 'delete') {
                _find($scope.visitors, operation.username, function(visitor, i) {
                    $scope.visitors.remove(i);
                });
            };

            if (operation.operate === 'add') {
                var find = false;
                _find($scope.visitors, operation.username, function(visitor, i) {
                    find = true;
                });
                if (!find) {
                    $scope.visitors.push(operation);
                }
            };

            if (operation.operate === 'init') {
                $scope.visitors = operation.username;
            }
        });
    }

    visitorController.$inject = ['$scope'];
    main_module.controller('VisitorController', visitorController);

})(this);