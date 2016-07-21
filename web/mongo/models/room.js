var mongoose = require('mongoose');
var shortid = require('shortid');

module.exports = mongoose.model('Room', new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    creator: {
        type: String,
        ref: 'User'
    },
    privacy: {
        default: 1,
        type: Number
    },
    participants: [{
        type: String,
        ref: 'User'
        //availability?
    }],
    name: {
        default: "",
        type: String
    },
    description: {
        default: "",
        type: String
    },
    start_date: {
        default: Date.now(),
        type: Date
    },
    end_date: {
        default: Date.now() + 8.64e+7, // add 24 hours
        type: Date,
    },
    location: {
        name: {
            type: String
        },
        coordinates: {
            type: String
        }
    },
    created: {
        default: Date.now(),
        type: Date
    },
    updated: {
        default: Date.now(),
        type: Date
    },
    dates: [{
        who: {
            type: String,
            ref: 'User'
        },
        dates: [{
            start: Date,
            end: Date
        }]
    }]
}));