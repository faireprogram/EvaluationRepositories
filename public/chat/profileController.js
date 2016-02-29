(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    var profileCtrl = function($scope, fileUploadService) {
        $scope.pop = {
            show: false
        };
        $scope.openCalendar = function() {
            $scope.pop = {
                show : true
            };
        }

        $scope.test = function() {
            var promise = fileUploadService.uploadFileToUrl($scope.myfile);
            promise.success(function(success) {
                console.log(success);
            }).error(function(err) {

            });
        }
    }

    profileCtrl.$inject = ['$scope', 'FileUploadService'];

    main_module.controller('ProfileCtrl', profileCtrl);

})(this);