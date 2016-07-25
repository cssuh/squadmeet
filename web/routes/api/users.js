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
            details: {
                name: req.body.name,
                nickname: req.body.nickname,
                //email: req.body.email,
                //phone: req.body.phone,
                description: req.body.description
            }
        });

        user.save(function(err, user) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 200,
                    message: "success"
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
                    details: {
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
            var friends = req.params.friend_ids.split(","),
                result = {};
            User.findOne({
                _id: req.params.user_id
            }).exec(function(err, user) {
                if (friends.length == 1) {
                    res.json(user.friends.indexOf(friends[0]) != -1);
                } else {
                    for (var i = 0; i < friends.length; i++) {
                        result[friends[i]] = user.friends.indexOf(friends[i]) != -1
                    }
                    res.json(result);
                }
            });
        } else {
            User.findOne({
                _id: req.params.user_id
            })
                .populate('friends')
                .select('friends _id')
                .exec(function(err, friends) {
                    if (err) {

                    } else {
                        res.json(friends);
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
                        //to be fixed
                        var friend_ids = req.params.friend_ids.split(',');
                        User.find({
                            _id: {
                                $in: friend_ids
                            }
                        }).exec(function(err, friends) {
                            var friend;
                            for (var i = 0; i < friends.length; i++) {
                                if (friend == user._id) {
                                    continue;
                                }
                                friend = friends[i];
                                user.friends.addToSet(friend._id);
                                user.save();
                                friend.friends.addToSet(user._id);
                                friend.save();
                                res.json({
                                    status: 200,
                                    message: 'success'
                                })
                            }

                        });
                    }
                })
        }
    })
    .delete(function(req, res, next) {

    });

module.exports = Router;