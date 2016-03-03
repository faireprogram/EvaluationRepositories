(function(global) {


    'use strict';
    var main_module = global.main_module;
    var roomSearchCtrl = function($scope, $http, $stateParams, $state, $q, noticeMessage) {
        
        var search = {
            name: $stateParams.name,
            tag: $stateParams.tag,
        };

        $scope.maxPer = 6;
        // $scope.currentPage = parseInt($stateParams.page) || 1;

         $http.post('/api/search', {query: search}).success(function(data) {
             $scope.maxSize = data.length;
         });

        var _update = function(currentPage) {
            var promise = [];
            promise.push($http.post('/api/search', {
                query: search,
                page: {
                    maxPer: $scope.maxPer,
                    currentPage: currentPage && currentPage > 0 ? currentPage : 0
                }
            }));

            promise.push($http.post('/api/search', {query: search}));

            $q.all(promise).then(function(res) {
                $scope.rooms = res[0].data; // rooms
                $scope.totalItems = res[1].data.length; // totalNumber
                $scope.currentPage = currentPage + 1;
                if(!$scope.rooms || !$scope.rooms.length) {
                    noticeMessage.warn('0 result is found !');
                }
            });
        };

        parseInt($stateParams.page) ? _update(parseInt($stateParams.page) - 1) : _update(0);
        
        $scope.pageChanged = function(num) {
             $state.go('search', {page: num});
        };

        $scope.maxSize = 10;

    }

    roomSearchCtrl.$inject = ['$scope', '$http', '$stateParams', '$state' ,'$q', 'NoticeMessage'];
    main_module.controller('RoomSearchCtrl', roomSearchCtrl);
})(this);