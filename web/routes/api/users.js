var express = require('express');
var Router = express.Router();

var mongoose = require('mongoose');

var Room = require('../../mongo/models/Room');
var User = require('../../mongo/models/User');

Router.route('/')
    .get(function(req, res, next) {
        User.find()
            .limit(10)
            .sort()
            .exec(function(err, users) {
                if (err) {

                } else {
                    res.json(users);
                }
            });
    })
    .post(function(req, res, next) {

        var user = new User({
            info: {
                name: req.body.name,
                nickname: req.body.nickname,
                emails: req.body.email,
                phones: req.body.phone,
                description: req.body.description
            }
        });

        user.save(function(err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 200,
                    message: 'success',
                    user: user
                });
            }
        });

    });

Router.route("/:user_id")
    .get(function(req, res, next) {
        //modifiers for populate
        User.findOne({
            _id: req.params.user_id
        })
            .populate('friends', 'details')
            .populate('rooms.hosting rooms.participating')
            .exec(function(err, user) {
                if (err) {

                } else {
                    res.json(user);
                }
            });
    })
    .put(function(req, res, next) {
        //update the details of the user
        User.findById(req.params.user_id, function(err, user) {
            if (err) {
                res.json(err);
            } else {
                user.set({
                    info: {
                        name: req.body.name || user.details.name,
                        nickname: req.body.nickname || user.details.nickname,
                        description: req.body.description || user.details.description,
                    }
                })
                user.save(function(err) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json({
                            message: 'success'
                        })
                    }
                })
            }
        })
    })
    .delete(function(req, res, next) {
        User.findOne({
            _id: req.params.user_id
        })
            .remove()
            .exec(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    //remove user from all rooms in
                    res.json({
                        status: 200,
                        message: "success"
                    })
                }
            });
    });

Router.route('/:user_id/rooms/:room_ids?')
    .get(function(req, res, next) {
        //if room_id check if user associate with room
        User.findOne({
            _id: req.params.user_id
        })
            .populate('rooms')
            .select('rooms -_id')
            .exec(function(err, rooms) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(rooms);
                }
            });
    })
    .put(function(req, res, next) {
        var rooms = req.params.room_ids.split(',');
    })
    .delete(function(req, res, next) {
        var rooms = req.params.room_ids.split(',')
    });

Router.route('/:user_id/friends/:friend_ids?')
    .get(function(req, res, next) {
        if (req.params.friend_ids) {
            User.findOne({
                _id: req.params.user_id
            }).exec(function(err, user) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(user.isFriendsWith(req.params.friend_ids));
                }
            });
        } else {
            User.findOne({
                _id: req.params.user_id
            })
                .populate('friends', 'info')
                .select('friends')
                .exec(function(err, result) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(result.friends)
                    }
                });
        }
    })
    .put(function(req, res, next) {
        if (!req.params.friend_ids) {
            res.json({
                status: 400,
                message: 'failed'
            })
        } else {
            User.findOne({
                _id: req.params.user_id
            })
                .exec(function(err, user) {
                    if (err) {
                        res.json(err);
                    } else {
                        user.addFriends(req.params.friend_ids, function(err, data) {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json({
                                    message: 'requests made',
                                    added: user.isFriendsWith(req.params.friend_ids)
                                });
                            }
                        });
                        //to be fixed
                    }
                })
        }
    })
    .delete(function(req, res, next) {
        if (!req.params.friend_ids) {
            res.json({
                status: 400,
                message: 'failed'
            })
        } else {
            User.findOne({
                _id: req.params.user_id
            })
                .exec(function(err, user) {
                    user.removeFriends(req.params.friend_ids, function(err) {
                        res.json(err || {
                            message: 'successfully removed'
                        })
                    });
                });
        }
    });

module.exports = Router;