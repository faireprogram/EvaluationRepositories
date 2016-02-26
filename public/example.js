ngular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);

angular.module('ui.bootstrap.demo').controller('AccordionDemoCtrl',
    function($scope) {
        $scope.oneAtATime = true;


        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
    });
