var mongoose = require('mongoose');
var shortid = require('shortid');

module.exports = mongoose.model('User', new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    details: {
        first_name: String,
        last_name: String,
        nickname: String,
        pic_url: String,
        email: String,
        phone: String,
        description: String,
    },
    unavailabilty: [{
    	start: Date,
    	end: Date
    }],
    rooms: [{
        type: String,
        ref: 'Room'
    }],
    friends: [{
        type: String,
        ref: 'User'
    }],
    created: {
        default: Date.now(),
        type: Date
    }
}));