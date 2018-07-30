var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Poll = require('../models/poll');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', {});
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {
                error: err.message
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {});
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

router.get('/addpoll', (req, res) => {
    res.render('addpoll', {});
});

router.post('/addpoll', (req, res) => {
    var new_poll = new Poll({
        title: req.body.title,
        question: req.body.question,
        userid: req.user.id,
        place: req.body.place,
        pdate: req.body.pdate,
        note: req.body.note,
        answers: req.body.answers
    });
    new_poll.save()
        .then(result => {
            res.render('addedpoll', {
                poll: result
            });
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/polls/:pollId', (req, res) => {
    if (req.user) {
        Poll.findById(req.params.pollId).exec()
            .then(onepoll => {
                let voted = false;
                onepoll.info.forEach(function (el) {
                    if (el['uid'] == req.user.id) {
                        voted = true;
                        lastvote = el['vote'];
                    }
                });
                if (voted) {
                    jcontent = onepoll.answers[lastvote].content;
                } else {
                    jcontent = undefined;
                }
                res.render('singlepoll', {
                    poll: onepoll,
                    jvoted: voted,
                    jchosen: jcontent
                });
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.render('errormember');
    }
});

router.post('/poll/:pollId', (req, res) => {
    if (req.body) {
        Poll.findById(req.params.pollId)
            .exec()
            .then(fpoll => {
                let voted = false;
                fpoll.info.forEach(function (el) {
                    if (el['uid'] == req.user.id) {
                        voted = true;
                        lastvote = el['vote'];
                    }
                });
                if (voted == false) {
                    fpoll.info.push({
                        uid: req.user.id,
                        vote: req.body.option
                    });
                    fpoll.answers[req.body.option].vote += 1;
                } else {
                    fpoll.info = fpoll.info.filter(function (obj) {
                        return obj.uid !== req.user.id;
                    });
                    fpoll.answers[lastvote].vote -= 1;
                }

                fpoll.save()
                    .then(saved => {
                        res.redirect('/polls/' + saved.id)
                    })
                    .catch(error => {
                        res.status(500).send(error);
                    });
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
});

router.get('/polls', (req, res) => {
    if (req.user) {
        Poll.find({
                userid: req.user.id
            }).exec()
            .then(jpolls => {
                res.render('polls', {
                    polls: jpolls
                });
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
    // if not member
    else {
        res.render('errormember');
    }
});

router.post('/poll/del/:pollId', (req, res) => {
    if (req.user) {
        Poll.findById(req.params.pollId).exec()
            .then(result => {
                if (req.user.id == result.userid) {
                    // Important Todo: remember to Remove poll from Account Table 

                    Poll.remove({
                            _id: result.id
                        }).exec()
                        .then(done => {
                            res.render('success');
                        })
                        .catch(error => {
                            res.status(500).send(error);
                        })
                } else {
                    res.render('wronguser');
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.render('errormember');
    }
});

router.get('/poll/edit/:pollId', (req, res) => {
    if (req.user) {
        Poll.findById(req.params.pollId).exec()
            .then(result => {
                res.render('editpoll', {
                    poll: result
                });
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.render('errormember');
    }
});

router.post('/poll/edit/:pollId', (req, res) => {
    if (req.user) {
        Poll.findById(req.params.pollId).exec()
            .then(result => {
                if (req.user.id == result.userid) {
                    var allans = req.body.answers;
                    // allans.forEach(element => {
                    //     element.content = allans.content;
                    // });
                    result.title = req.body.title,
                    result.question = req.body.question,
                    result.place = req.body.place,
                    result.pdate = req.body.pdate,
                    result.note = req.body.note;
                    for (var i = 0; i < allans.length; i++) {
                        result.answers[i].content = allans[i].content;
                    }
                    result.save()
                        .then(newpoll => {
                            res.render('success');
                        })
                        .catch(error => {
                            res.status(500).send(error);
                        });
                } else {
                    res.render('wronguser');
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.render('errormember');
    }
});

module.exports = router;