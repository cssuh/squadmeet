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

        Room.find().sort(sort).limit(limit).exec(function(err, rooms) {
            if (err) {
                res.json(err);
            } else {
                res.json(rooms);
            }
        });
    })
    .post(function(req, res, next) {

        var room = new Room({
            room: {
                host: req.body.host,
                privacy: req.body.privacy
            },
            event: {
                name: req.body.name,
                description: req.body.description,
                location: {
                    name: req.body.location_name,
                    coordinates: req.body.location_coords
                }
            }
        });
        //add the room to the creator
        User.findUserAndAddRoom(room, null, function(data) {
            res.json(data);
        })
    });

Router.route('/:room_id')
    .get(function(req, res, next) {
        Room.findOne({
            _id: req.params.room_id
        })
            .populate('room.host', 'details')
            .populate('room.participants.user', 'details')
            .exec(function(err, room) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(room);
                }
            });
    })
    .put(function(req, res, next) {
        Room.findOne({
            _id: req.params.room_id
        })
            .exec(function(err, room) {
                if (err) {
                    res.json(err);
                } else if (!room) {
                    res.json({
                        message: 'room not found'
                    });
                } else {
                    room.set({
                        room: {
                            host: req.body.host || room.room.host,
                            privacy: req.body.privacy || room.room.privacy
                        },
                        event: {
                            name: req.body.name || room.event.name,
                            description: req.body.description || room.event.description,
                            location: {
                                name: req.body.location_name || room.event.location.name,
                                coordinates: req.body.location_coords || room.event.location.coordinates
                            }
                        }
                    })
                    room.save(function(err) {
                        res.json(err || {
                            message: 'success'
                        })
                    })
                }
            })
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
        //comma delimeted user-ids
        if (req.params.participant_ids) {
            res.json("To Be Implemented Soon")
        } else {
            Room.findOne({
                _id: req.params.room_id
            })
                .populate('room.participants.user', 'details')
                .select('room.participants')
                .exec(function(err, result) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(result.room.participants);
                    }
                });
        }
    })
    .put(function(req, res, next) {
        //add participants to room
        if (!req.params.participant_ids) {
            res.json({
                status: 400,
                message: "Request requires at least one participant-id"
            })
        } else {
            //participants are comma delimited
            var party = req.params.participant_ids.split(',');
            Room.findOne({
                _id: req.params.room_id
            })
                .exec(function(err, room) {
                    if (err) {
                        res.json(err);
                    } else if (!room) {
                        res.json(null);
                    } else {
                        User.findUserAndAddRoom(room, party, function(data) {
                            res.json(data);
                        });
                    }
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
            var party = req.params.participant_ids.split(',');
            Room.findOne({
                _id: req.params.room_id
            })
                .exec(function(err, room) {

                })
        }
    });

Router.route('/:room_id/dates/:user_id?/:date_ranges?')
    .get(function(req, res, next) {
        if(req.params.user_id){
            //get particular dates for one user
        }
        // get all the dates for everyone in room
        Room.findOne({
            _id: req.params.room_id
        })
            .select('room.participants.availability room.participants.user')
            .exec(function(err, result) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result.room.participants);
                }
            })
    })
    .put(function(req, res, next) {
        var user_id = req.params.user_id;
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
            .select('room.participants.availability room.participants.user')
            .exec(function(err, results){
                res.json(results);
            })
    })
    .delete(function(req, res, next) {

    });

Router.route('/:room_id/host').get(function() {
    Room.findOne({
        _id: req.params.room_id
    })
        .populate('room.host')
        .select('room.host')
        .exec(function(err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        })
});

module.exports = Router;