var express = require('express');
var Router = express.Router();

var mongoose = require('mongoose');

var Room = require('../../mongo/models/Room');
var User = require('../../mongo/models/User');

Router.route('/')
    .get(function(req, res, next) {
        //return every room
        var q = req.query,
            limit = parseInt(q.limit) || 10,
            sort = q.sort || "created"; // created, -created, etc...

        Room.find().limit(limit).sort(sort).exec(function(err, rooms) {
            if (err) {
                res.json(err);
            } else {
                res.json(rooms);
            }
        });
    })
    .post(function(req, res, next) {
        console.log(req.body);

        var room = new Room({
            creator: req.body.creator,
            privacy: req.body.privacy,
            name: req.body.name,
            description: req.body.description,
        });
        //add the room to the creator
        User.findOne({
            _id: room.creator
        }, function(err, user) {
            if (err) {
                res.json(err)
            } else {
                if (!user) {
                    res.json({
                        status: 400,
                        message: 'user does not exist'
                    })
                } else {
                    user.rooms.push(room._id);
                    user.save();
                    room.save();
                    res.json({
                        status: 200,
                        message: 'success'
                    });
                }
            }
        })

    });

Router.route('/:room_id')
    .get(function(req, res, next) {
        Room.findOne({
            _id: req.params.room_id
        })
            .populate('creator', 'details')
            .exec(function(err, room) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(room);
                }
            });
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {
        Room.findOne({
            _id: req.params.room_id
        }).remove().exec(function(err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 200,
                    message: "success"
                })
            }
        });
    });

Router.route('/:room_id/participants/:participant_ids?')
    .get(function(req, res, next) {
        if (req.params.participant_ids) {
            var ids = req.params.participants_ids.split(","),
                results = {};
            Room.findOne({
                _id: req.params.room_id
            })
                .exec(function(err, room) {
                    if (ids.length == 1) {
                        res.json(room.participants.indexOf(ids[0] != -1))
                    } else {
                        for (var i = 0; i < ids.length; i++) {
                            results[ids[i]] = room.participants.indexOf(ids[i]) != -1;
                        }
                        res.json(results)
                    }
                    //check if participant
                });
        } else {
            Room.findOne({
                _id: req.params.room_id
            })
                .populate('participants')
                .select('participants')
                .exec(function(err, room) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(room);
                    }
                });
        }
    })
    .put(function(req, res, next) {
        //add participants
        if (!req.params.participant_ids) {
            res.json({
                status: 400,
                message: "Request requires at least one participant-id"
            })
        } else {
            Room.findOne({
                _id: req.params.room_id
            })
                .exec(function(err, room) {

                })
        }
    })
    .delete(function(req, res, next) {
        //remove participants
        if (!req.params.participant_ids) {
            res.json({
                status: 400,
                message: "Request requires at least one participant-id"
            })
        } else {

        }
    });

Router.route('/:room_id/dates/:date_ranges?/:user_id?')
    .get(function(req, res, next) {

    })
    .put(function(req, res, next) {
        var dates = req.params.date_ranges.split(',').map(function(date) {
            var range = date.split("+");
            return {
                start: new Date(range[0]),
                end: new Date(range[1])
            };
        });
        Room.findOne({
            _id: req.params.room_id
        })
            .exec(function(err, room) {
                room.save();
            });
    })
    .delete(function(req, res, next) {

    });

Router.route('/:room_id/creator').get(function() {
    Room.findOne(req.pa)
});

module.exports = Router;