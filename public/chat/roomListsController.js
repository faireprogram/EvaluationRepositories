(function(global) {


    'use strict';
    var main_module = global.main_module;
    var roomListsCtrl = function($scope, $state) {
    	$scope.rooms = [123,124,125,127,1239,32132,13213,231321];
    	$scope.$state = $state;
    }

    roomListsCtrl.$inject = ['$scope','$state'];
    main_module.controller('RoomListsCtrl', roomListsCtrl);

})(this);