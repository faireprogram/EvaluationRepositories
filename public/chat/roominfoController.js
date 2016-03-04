(function(global) {
    'use strict';
    var main_module = global.main_module;
    var modal;
    var roomInfosCtl = function($scope, $uibModal, $http, sharedDataService, noticeMessage) {
        if (sharedDataService.login.pid) {
            $http.post('/api/roomlistsofuser', {
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
                $http.post('/api/roomlistsofuser', {
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
            if (!sharedDataService.login.verify) {
                noticeMessage.error('You Should Activate Your Email First!!');
                return;
            }
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

        $scope.$watch('rooms', function(n, old) {
            console.log('new', n);
        }, true);

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
            };
        }

        $scope.changestatus = function(rid, roomstatus) {
            console.log('sent', roomstatus, rid);
            $http.post('/api/updateRoomstatus', {
                rid: rid,
                status: roomstatus
            }).success(function(room) {
                // console.log(data);
                if ($scope.rooms) {
                    var find = -1;
                    $scope.rooms.forEach(function(eachRoom, ind) {
                        if (eachRoom.rid == room.rid) {
                            find = ind;
                        };
                    });

                    if (find != -1 && roomstatus) {
                        $scope.rooms[find].status.closeDate = null;
                    }
                    if (find != -1 && !roomstatus) {
                        $scope.rooms[find].status.closeDate = room.status.closeDate;
                    }
                    noticeMessage.info('room successful saved!');
                }
            }).error(function(err) {
                console.log(err);
            });
        }
    }
    roomInfosCtl.$inject = ['$scope', '$uibModal', '$http', 'ShareDataService', 'NoticeMessage'];
    main_module.controller('RoomInfosCtl', roomInfosCtl);

})(this);