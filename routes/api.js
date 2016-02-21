var router = require('express').Router();
var mongodbAPI = require('../db/mongodb.js');
var $injector = require('../util/injector.js');

// login
router.post('/login', function(req, res, next) {
    if (req.session.user) {
        res.json({
            status: "ok",
            username: req.session.user.username
        });

    } else if (!req.session.user && req.body.user) {
        var user = req.body;
        mongodbAPI.checklogin(user).then((userFind) => {
            //put it in the session
            req.session.user = userFind;

            req.session.save();

            res.json({
                'status': "ok",
                username: userFind.username
            });
        }).catch((err) => {
            res.json({
                'status': 'loginerror',
                'msg': err
            });
        });

    } else {
        res.json({
            'status': 'error',
            'msg': 'Unknown Error'
        });
    }
});

router.post('/register', function(req, res, next) {
    //validate user
    if (req.body.user) {
        mongodbAPI.register(req.body.user).then(function(user) {
        	req.session.user = user;
        	req.session.save();

            res.json({
                'status': 'ok',
                'username': user.username
            });

        }).catch(function(err) {
            res.json({
                'status': 'registererror',
                'msg': err
            });
        });
    } else {

        res.json({
            'status': 'error',
            'msg': 'Unknown Error'
        });
    }

});


// loginout

router.post('/loginout', function(req, res, next) {
    if (req.session) {
        var username = req.session.user.username;
        req.session.destroy(function(err) {
            res.json({username: username});
        });
    }

});


// //active login status
router.get('/active/:activecode', function(req, res, next) {

});


/////////////////////////////////////////////////////////////////
////  ROOM PART

//// show all rooms
router.post('/roomlists', function(req, res, next) {
    mongodbAPI.findAllLivesRoom().then(function(allLivedRooms){
        res.json(allLivedRooms);
    });
});

//// add Room
router.post('/addRoom', function(req, res, next) {
    mongodbAPI.createChatRoom(req.body).then(function(savedRoom){
        res.json(savedRoom);
    });
});

//// check roomExist
router.post('/roomExist', function(req, res, next) {
    mongodbAPI.isRoomLive(req.body.rid).then(function(isRoomLive){
        res.json({status: isRoomLive});
    });
});

module.exports = router;