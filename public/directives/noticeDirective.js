(function(global) {

    'use strict';
    var main_module = global.main_module;

    main_module.directive('noticeMessage', function() {
        return {
            template: '',
            scope: {
                'message': '=',
                'type': '=',
                'display': '=',
                'close': '&'
            },
            link: function(scope, element, attrs) {
                element.addClass('notice').addClass(scope.type) // add type
                element.append('<div class="close">X</div>');
                element.append('<div class="message"></div>');
                var messageElement = angular.element(element.children()[1]);
                var closeElement = angular.element(element.children()[0]);
                
                closeElement.on('click', function() {
                    scope.close();
                    scope.$apply();
                });
                scope.$watch('message', function(n, old) {
                    if (n) {
                        messageElement.html(scope.message);
                    };
                });
            }
        };
    });
})(this);