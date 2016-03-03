(function(global) {


    'use strict';
    var main_module = global.main_module;

    var mainCtrl = function($scope, $timeout, noticeMessage) {
        $scope.$on('SHOW_MESSAGE', function(eve, data) {
            $scope.messageDisplay = true;
            $scope.message = data.msg;
            $scope.type = data.type;
            if ($scope.type == 'info' || $scope.type == 'warn') {
                $timeout(function() {
                    noticeMessage.hide();
                }, 2000);
            }
        });

        $scope.$on('HIDE_MESSAGE', function(eve) {
            $scope.messageDisplay = false;
            $scope.message = '';
        });

        $scope.closeMsg = function() {
            noticeMessage.hide();
        }
    }

    mainCtrl.$inject = ['$scope', '$timeout', 'NoticeMessage'];
    main_module.controller('MainCtrl', mainCtrl);

})(this);