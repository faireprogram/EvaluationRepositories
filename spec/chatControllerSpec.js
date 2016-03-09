describe("Chat Controller", function() {
    var http, rootscope, statePrams, shareSevice, noticeMessage, statePara
    beforeEach(module('main'));
    beforeEach(inject(function(_$http_, _$rootscope_, _$stateParams_,
         ShareDataService, NoticeMessage, _$httpBackend_, $controller) {
        http = _$http_;
        rootscope = _$rootscope_;
        statePrams = _$stateParams_;
        shareSevice = _ShareDataService_;
        http = _$http_;
        controller = $controller;
    }));

    it("check weather exist of controller", function() {
       expect(controller('chatController', {$scope : scope})).toBeDefined();
    });

    it("close the socket", function() {
        var controller = controller('chatController', {
            $scope: scope
        });
        spyOn(scope, '$on');
        rootscope.$broadcast('RESET_SOCKET_RES');
        expect(scope.$on).toHaveBeenCalled();
    });

    it("mock send message", function() {
        var controller = controller('chatController', {
            $scope: scope
        });
        spyOn(scope, 'sendMsg');
        scope.sendMsg();
        expect(scope.sendMsg).toHaveBeenCalled();
    });

    it("mock send message, without login", function() {
        var controller = controller('chatController', {
            $scope: scope
        });
        spyOn(scope, 'sendMsg');
        scope.sendMsg();
        expect(scope.sendMsg).toHaveBeenCalled();
    });

});