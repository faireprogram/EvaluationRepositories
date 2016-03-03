(function(global) {


    'use strict';
    var main_module = global.main_module;
    var roomListsCtrl = function($scope, $http, noticeMessage) {
        $http.post('/api/roomlists').success(function(rooms) {
            $scope.rooms = rooms;
        })
        // $scope.rooms = [123,124,125,127,1239,32132,13213,231321];
    }

    roomListsCtrl.$inject = ['$scope', '$http', 'NoticeMessage'];
    main_module.controller('RoomListsCtrl', roomListsCtrl);
})(this);