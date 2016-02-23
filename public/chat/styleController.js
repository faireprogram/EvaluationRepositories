(function(global) {


    'use strict';
    var main_module = global.main_module;
    var styleCtrl = function($scope, $http, $stateParams) {
    	$http.post('/api/roomInfo', {rid: $stateParams.roomId}).success(function(roomInfo) {
    		$scope.roomInfo = roomInfo;
    	})
    	// $scope.rooms = [123,124,125,127,1239,32132,13213,231321];
    }

    styleCtrl.$inject = ['$scope', '$http' ,'$stateParams'];
    main_module.controller('StyleCtrl', styleCtrl);
})(this);