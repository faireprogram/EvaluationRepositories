(function(global) {


    'use strict';



    var main_module = global.main_module;
    var navCtrl = function($scope, $state, $window) {
        $scope.search = function(name) {
            $state.go('search', {name: name});
        }

         $($window).on('scroll', function(eve) {
            
            if($window.scrollY > 50) {
                $('.navclude').css('position', 'fixed');
            } else {
                $('.navclude').css('position', 'static');
            }
         });
        // $http.post('/api/search', )
    }

    navCtrl.$inject = ['$scope', '$state', '$window'];
    main_module.controller('NavCtrl', navCtrl);
})(this);