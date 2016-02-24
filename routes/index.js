var express = require('express');
var mongoAPI = require('../db/mongodb.js');
var router = express.Router();
var fs = require('fs');
var $injector = require('../util/injector.js');
var C2Subject = require('../util/c2sobserver.js').C2SSubject;


/* GET home page. */
router.get('/test', function(req, res, next) {
    res.render('index');
});

router.get('/room', function(req, res, next) {
    res.render('index');
});

router.get('/grasp/:roomId', function(req, res, next) {
    var roomId = req.params.roomId;

    mongoAPI.findChatRoomById(roomId).then(function(room) {
        fs.readFile('./public/jade/phantom.template', 'utf8', (err, data) => {
            var roomInstance = $injector.getInstance(roomId, C2Subject, roomId) || {};
            var visitors = roomInstance.clients || [];
            var messages = roomInstance.lastestMsgs || [];

            var visitorsHtmlTemplate = '<li class="active">' +
                '<a class="list" href="#">' +
                '@ <span class="sr-only">(current)</span>' +
                '</a>' +
                '</li>';

            var msgsHtmlTemplate = '<div ng-class="msg_position(msg)" class="message">' +
                '<p> @ </p>' +
                '</div>';

            var htmlArr = data.split('\n');
            for (var i in htmlArr) {
                var item = htmlArr[i];
                if (/ng-repeat/.test(item)) {
                    if (/visitor/.test(item)) {
                        var visitor_html = '';
                        visitors.forEach(function(visitor) {
                            visitor_html = visitor_html + visitorsHtmlTemplate.replace('@', visitor) + '\n';
                        });
                        htmlArr[i] = visitor_html + htmlArr[i];
                    };

                    if (/msg/.test(item)) {
                        var msg_html = '';
                        messages.forEach(function(msg) {
                            msg_html = msg_html + msgsHtmlTemplate.replace('@', msg.content) + '\n';
                        });
                        htmlArr[i] = msg_html + htmlArr[i];
                    };
                }
                if(/ng-href/.test(item)) {
                    htmlArr[i] = htmlArr[i].replace('@', '/stylesheets/' + room.style + '.css');
                }
            };

            res.send(htmlArr.join('\n'));

        });
    });

});




module.exports = router;