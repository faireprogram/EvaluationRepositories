(function(global) {
    'use strict';
    var main_module = global.main_module;
    var modal;
    var roomInfosCtl = function($scope, $uibModal, $http, sharedDataService) {
        if (sharedDataService.login.pid) {
            $http.post('/api/roomlists', {
                pid: sharedDataService.login.pid
            }).success(function(rooms) {
                $scope.rooms = rooms;
            });
        };

        $scope.oneAtATime = true;
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.$on('CHANGE_LOGIN_NAME_RES', function() {
            if (sharedDataService.login.pid) {
                $http.post('/api/roomlists', {
                    pid: sharedDataService.login.pid
                }).success(function(rooms) {
                    $scope.rooms = rooms;
                });
            }
        });


        // $scope.rooms = [{
        //     rid: 333,
        //     description: 'winder,winter',
        //     tags: ['life', 'entertainment', 'view'],
        //     status: {
        //         open: 'open',
        //         createDate: 'today',
        //         closeDate: 'tomorrow'
        //     }
        // }];
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
            var login = JSON.parse(global.localStorage.getItem('login'));
            if (sharedDataService.login.username) {
                newRoom.owner = {
                    username: login.username,
                    pid: login.pid
                }
                newRoom.tags = $scope.tags;
                $http.post('/api/addRoom', newRoom).success(function(newRecord) {
                    modal.close(newRecord);
                });
            };
        };

        $scope.styles = ['BlueOcean', 'OrangeGreen', 'PinkGirl', 'PurpleMagic', 'RedChristmas', 'WhiteJoey', 'YellowFruit'];

        $scope.$watch('newRoom.tag', function(n, o) {
            if (n) {
                $http.post('/api/tagsAssist', {
                    input: n ? n.trim() : ''
                }).success(function(filterArr) {
                    $scope.potentialTags = filterArr;
                });
            } else {
                $scope.potentialTags = [];
            };
        });

        if (!$scope.newRoom) {
            $scope.newRoom = {};
        }
        $scope.newRoom.schema = 'BlueOcean';

        $scope.select = function(selectSchema) {
            if (!$scope.newRoom) {
                $scope.newRoom = {};
            }
            $scope.newRoom.schema = selectSchema;
        };

        $scope.selectTag = function(tag) {
            $scope.newRoom.tag = tag;
        };

        $scope.addTag = function(tag) {
            if (!$scope.tags) {
                $scope.tags = [];
            };
            var index = -1;
            $scope.tags.forEach(function(item, ind) {
                if (item === tag) {
                    index = ind;
                };
            });

            if (index == -1) {
                $scope.tags.push(tag);
            }
        }

        $scope.closeTag = function(tag) {
            var index = -1;
            $scope.tags.forEach(function(item, ind) {
                if (item === tag) {
                    index = ind;
                };
            });

            if (index != -1) {
                $scope.tags.remove(index);
            }
        }
    }
    roomInfosCtl.$inject = ['$scope', '$uibModal', '$http', 'ShareDataService'];
    main_module.controller('RoomInfosCtl', roomInfosCtl);

})(this);
