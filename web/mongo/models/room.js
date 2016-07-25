var mongoose = require('mongoose');
var shortid = require('shortid');

var RoomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    event: {
        name: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        range: {
            start: {
                type: Date,
                default: Date.now()
            },
            end: {
                type: Date,
                default: Date.now() + 8.64e+7
            }
        },
        location: {
            name: String,
            coordinates: String
        }
    },
    room: {
        host: {
            type: String,
            ref: 'User',
            required: true
        },
        participants: [{
            _id: false,
            status: Number, // 0=invited, 1=accepted, 2=rejected
            user: {
                type: String,
                ref: 'User'
            },
            availability: [{
                start: Date,
                end: Date
            }]
        }],
        privacy: {
            type: Number,
            default: 1
        },
        created: {
            type: Date,
            default: Date.now()
        },
        updated: {
            type: Date,
            default: Date.now()
        }
    }
});

RoomSchema.statics.findById = function(id, cb) {
    return this.find({
        _id: id
    }, cb);
};

RoomSchema.methods.updateRoom = function(details, cb) {
    /*var keys = Object.keys[details];
    for (var i = 0; i < keys.length; i++) {
    }*/
    this.updated = Date.now();
    this.save();
}

RoomSchema.methods.hasParticipant = function(user_id) {
    return this.room.participants.indexOf(user_id) != -1;
}

RoomSchema.methods.addParticipants = function(participants, cb) {

};

RoomSchema.methods.removeParticipants = function(participants, cb) {

};

RoomSchema.methods.addDates = function(dates, cb) {

};

RoomSchema.methods.removeDates = function(dates, cb) {

}


module.exports = mongoose.model('Room', RoomSchema);