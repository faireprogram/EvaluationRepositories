(function(global) {


    'use strict';
    var main_module = global.main_module;

    //controller define

    var profileCtrl = function($scope, $http, $q, fileUploadService, noticeMessage, sharedService) {
        if (sharedService.login.pid) {
            var defer = $q.defer();
            $http.post('/api/retrieveUser', {
                pid: sharedService.login.pid
            }).success(function(user) {
                $scope.username = user.user.username;
                $scope.user = {
                    pid: user.user.pid,
                    birthDay: new Date(user.user.birthDay),
                    gender: user.user.gender,
                    email: user.user.email
                };
                defer.resolve();
            });
            $scope.promise = defer.promise;
        };

        $scope.$on('CHANGE_LOGIN_NAME_RES', function() {
            if (sharedService.login.pid) {
                $http.post('/api/retrieveUser', {
                    pid: sharedService.login.pid
                }).success(function(user) {
                    $scope.username = user.user.username;
                    $scope.user = {
                        pid: user.user.pid,
                        birthDay: new Date(user.user.birthDay),
                        gender: user.user.gender,
                        email: user.user.email
                    };
                });
            };
        });

        $scope.pop = {
            show: false
        };

        $scope.openCalendar = function() {
            $scope.pop = {
                show: true
            };
        };

        $scope.saveChanges = function() {
            $http.post('/api/modify/saveProfileChanges', {user: $scope.user}).success(function() {
                noticeMessage.info('Successful Saved the changes');
            }).error(function() {
                noticeMessage.error('Error Happens, please check your input');
            })
        }


        $scope.uploadImage = function() {
            var promise = fileUploadService.uploadFileToUrl($scope.myfile);
            promise.success(function(success) {
                noticeMessage.info('You Successful Update your Image');
            }).error(function(err) {
                noticeMessage.error('Some Problems Happens!!');
            });
        }

        $scope.resendEmail = function() {
            if(sharedService.login.pid) {
                $http.post('/api/resend/', {email: $scope.user.email, pid: sharedService.login.pid}).success(function() {
                    noticeMessage.info('Successful Send Email, please check your email account');
                }).error(function() {
                    noticeMessage.error('Error Happens, please check your input');
                })
            } else {
                noticeMessage.error('Please login first');
            }
            
        }
    }

    profileCtrl.$inject = ['$scope', '$http', '$q', 'FileUploadService', 'NoticeMessage', 'ShareDataService'];

    main_module.controller('ProfileCtrl', profileCtrl);

})(this);