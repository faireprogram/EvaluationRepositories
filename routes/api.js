var router = require('express').Router();
var util = require('../util/util.js');
var mongodbAPI = require('../db/mongodb.js');
var $injector = require('../util/injector.js');
var staticsService = require('../service/staticticsService.js');
var execFile = require('child_process').execFile;
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');


// login
router.post('/login', function(req, res, next) {
    if (req.session.user) {
        res.json({
            status: "ok",
            username: req.session.user.username,
            pid: req.session.user.pid
        });

    } else if (!req.session.user && req.body.user) {
        var user = req.body.user;
        console.log(user);
        mongodbAPI.checklogin(user).then((userFind) => {
            //put it in the session
            req.session.user = userFind;

            req.session.save();

            res.json({
                'status': "ok",
                username: userFind.username,
                pid: userFind.pid
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
                'username': user.username,
                'pid': user.pid
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
            res.json({
                username: username
            });
        });
    }

});


router.get('/profileImg/:pid', function(req, res, next) {
    var pid = req.params.pid;
    mongodbAPI.findImg(pid).then(function(img) {

        res.header({
        'Content-Type': img.mimetype
        });
        res.send(img.data);
    });
});


// //active login status
router.get('/active/:activecode', function(req, res, next) {

});


/////////////////////////////////////////////////////////////////
////  ROOM PART

//// show all rooms
router.post('/roomInfo', function(req, res, next) {
    mongodbAPI.findChatRoomById(req.body.rid).then(function(room) {
        res.json(room);
    });
});

//// show all rooms
router.post('/roomlists', function(req, res, next) {
    mongodbAPI.findAllLivesRoom(req.body.pid).then(function(allLivedRooms) {
        res.json(allLivedRooms);
    });
});

//// add Room
router.post('/addRoom', function(req, res, next) {
    mongodbAPI.createChatRoom(req.body).then(function(savedRoom) {
        var child = execFile('./autobash/screenphantom.js', [savedRoom.rid], (error, stdout, stderr) => {
            res.json(savedRoom);
        });
    });
});

//// check roomExist
router.post('/roomExist', function(req, res, next) {
    mongodbAPI.isRoomLive(req.body.rid).then(function(isRoomLive) {
        res.json({
            status: isRoomLive
        });
    });
});

router.post('/tagsAssist', function(req, res, next) {
    var pattern = '^' + req.body.input ? req.body.input.trim() : '';
    var resExp = new RegExp(pattern, 'i');
    var tags = ['life', 'life1', 'life2', 'abx', 'Abx', 'aBx', 'Cbx', 'Dbx'];
    var filterArray = tags.filter(function(item) {
        return resExp.test(item);
    });

    res.json(filterArray);
});

//// statistics
router.post('/roomStatistics/week', function(req, res, next) {
    if (req.session.user) {
        var pid = req.session.user.pid;
        staticsService.groupWeekByUser(pid).then(function(data) {
            res.json(data);
        });
    } else {
        res.json({
            'err': 'no login'
        });
    };

});

router.post('/roomStatistics/weekTotal', function(req, res, next) {
    if (req.session.user) {
        var pid = req.session.user.pid;
        staticsService.groupWeekTotalByUser(pid).then(function(data) {
            res.json(data);
        });
    } else {
        res.json({
            'err': 'no login'
        });
    };
});

router.post('/roomStatistics/month', function(req, res, next) {
    if (req.session.user) {
        var pid = req.session.user.pid;
        var now = new Date().getFullYear();
        staticsService.groupMonthByUser(pid, now).then(function(data) {
            res.json(data);
        });
    } else {
        res.json({
            'err': 'no login'
        });
    };
});

router.post('/roomStatistics/monthTotal', function(req, res, next) {
    if (req.session.user) {
        var pid = req.session.user.pid;
        var now = new Date().getFullYear();
        staticsService.groupMonthTotalByUser(pid, now).then(function(data) {
            res.json(data);
        });
    } else {
        res.json({
            'err': 'no login'
        });
    };
});

/////////////////////////////////////////////////////////////////
////  Search PART

router.post('/search/', function(req, res, next) {
    var query = req.body.query;
    var page = req.body.page;
    var pageNation;
    if (page && util.num.isNum(page.currentPage) && util.num.isNum(page.maxPer)) {
        var currentRecords = parseInt(page.currentPage) * parseInt(page.maxPer);
        pageNation = {
            currentRecords: currentRecords,
            maxPer: parseInt(page.maxPer)
        };
    };

    mongodbAPI.findRoomByMulitpleConditons(query, pageNation).then(function(result) {
        if (result) {
            res.json(result);
        } else {
            res.json({});
        }
    });
});

/////////////////////////////////////////////////////////////////
////  Profile Image Part

router.post('/modify/changeimg', upload.single('avatar'), function(req, res, next) {
    if (req.session.user) {
        var path = req.file.path;
        var mimetype = req.file.mimetype;
        fs.readFile(path, function(err, content) {
            var img = {
                mimetype: mimetype,
                data:  content
            };
            mongodbAPI.changeImg(req.session.user.pid, img).then(function(succes) {
                res.json({'save' : 'success'});
            }).catch(function(err) {
                res.json({'save' : 'failed'});
            });
        });
    } else {
        res.json({
            'err': 'no login'
        });
    };
});


module.exports = router;