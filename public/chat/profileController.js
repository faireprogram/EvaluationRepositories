(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    var profileCtrl = function($scope, Upload, $timeout) {
        $scope.pop = {
            show: false
        };
        $scope.openCalendar = function() {
            $scope.pop = {
                show : true
            };
        }
    }

    profileCtrl.$inject = ['$scope', 'Upload', '$timeout'];

    main_module.controller('ProfileCtrl', profileCtrl);

})(this);