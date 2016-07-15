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
            sort = q.sort; // created, -created, etc...

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
            creator: req.body.creator
        });
        //save the room
        room.save(function(err, room) {
            if (err) {
                res.json(err)
            } else {
                //add the room to the creator
                User.findOne({
                    _id: room.creator
                }, function(err, user) {
                    if (err) {
                        res.json(err)
                    } else {
                        user.rooms.push(room._id);
                        user.save();
                        res.json({message:'success'});
                    }
                })
            }
        });

    });

Router.route('/:room_id')
    .get(function(req, res, next) {
        Room.findOne({
            _id: req.params.room_id || "ANON"
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
            	User.find({
            		$inc: 'jkl'
            	});
                res.json({
                    message: "success"
                })
            }
        });
    });

Router.route('/:room_id/participants/:participant_id?')
    .get(function(req, res, next) {
        Room.findOne({
        	_id: req.params.room_id
        })
        	.populate('')
        	.select('')
        	.exec();
    })
    .post(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });

Router.route('/:room_id/creator').get(function() {

});

module.exports = Router;