(function(global) {
    'use strict';
    var main_module = global.main_module;
    var modal;
    var roomInfosCtl = function($scope, $uibModal, $http) {
        $scope.rooms = [{
            rid: 333,
            description: 'winder,winter',
            tags: ['life', 'entertainment', 'view'],
            status: {
                open: 'open',
                createDate: 'today',
                closeDate: 'tomorrow'
            }
        }];
        $scope.openAddRoom = function() {
            console.log('hello');
            modal = $uibModal.open({
                templateUrl: '/template/models/addRoom.html',
                controller: roomInfosCtl
            });

            modal.result.then(function(newRecord) {
                $scope.rooms.push(newRecord);
            })
        }

        $scope.saveRoom = function(newRoom) {
            console.log('wowowowlalala', newRoom);
            $http.post('/api/addRoom', newRoom).success(function(newRecord) {
                modal.close(newRecord);
            })
        }

    }

    roomInfosCtl.$inject = ['$scope', '$uibModal', '$http'];
    main_module.controller('RoomInfosCtl', roomInfosCtl);

})(this);