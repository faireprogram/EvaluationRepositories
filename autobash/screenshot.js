var Q = require('q');
var page = require('webpage').create();
page.viewportSize = {
    width: 1024,
    height: 768
};

var grasp = function(roomId) {
    var defer = Q.defer();
    page.open('http://localhost:8090/grasp/' + roomId, function(status) {
        console.log("Status: " + status);
        console.log('roomId', roomId);
        if (status === "success") {
            page.render('./public/resource/screenshots/' + roomId + '.png');
            defer.resolve();
        } else {
            defer.reject();
        }
    });
    return defer.promise;
}


var graspAll = function(roomIds) {
    var roomIds = roomIds;
    var promise;
    roomIds.forEach(function(roomId, i) {
        if (i == 0) {
            promise = grasp(roomId);
        } else {
            promise = promise.then(function() {
                return grasp(roomId);
            });
        }
    });

    promise.then(function () {
        phantom.exit();
    });
}

// graspAll();

// setTimeout(graspAll, 5 * 1000);
module.exports = {
    grasp: grasp,
    graspAll : graspAll
}
