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
                first_name: "Khauri",
                last_name: "McClain",
                nickname: "Creator",
                email: "kmcclain@email.wm.edu",
                phone: "NULL",
                description: "I made this shit!"
            }
        });

        user.save(function(err, user) {
            if (err) {
                res.json(err);
            } else {
                res.json({
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
            .populate('rooms')
            .exec(function(err, user) {
                if (err) {

                } else {
                    res.json(user);
                }
            });
    })
    .put(function(req, res, next) {
        User.findOne({
            _id: req.params.user_id
        }, function(err, user) {

        });
    });

Router.route('/:user_id/rooms/:room_id?')
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

    })
    .delete(function(req, res, next) {

    });

Router.route('/:user_id/friends/:friend_id?')
    .get(function(req, res, next) {
        User.findOne({
            _id: req.params.user_id
        })
            .populate('friends')
            .select('friends -_id')
            .where('friends')
            .slice(10)
            .exec(function(err, friends) {
                if (err) {

                } else {
                    res.json(friends);
                }
            });
    })
    .put(function(req, res, next) {
        if (!req.params.friend_id) {
            res.json({
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
                        User.findOne({
                            _id: req.params.friend_id
                        })
                            .exec(function(err, friend) {
                                if (err) {

                                } else if (friend) {
                                    user.friends.addToSet(friend._id);
                                    user.save();
                                    friend.friends.addToSet(user._id);
                                    friend.save();
                                    res.json({
                                        message: 'success'
                                    });
                                }
                            })
                    }
                })
        }
    })
    .delete(function(req, res, next) {

    });

module.exports = Router;