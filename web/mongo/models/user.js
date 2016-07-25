var mongoose = require('mongoose');
var shortid = require('shortid');

var userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    details: {
        name: String,
        nickname: {
            type: String,
            required: true
        },
        pic_url: String,
        emails: [String],
        phones: [Number],
        description: String,
    },
    // stores up to 7 days of availability
    unavailabilty: [{
        start: Date,
        end: Date
    }],
    rooms: {
        hosting: [{
            type: String,
            ref: 'Room'
        }],
        participating: [{
            type: String,
            ref: 'Room'
        }]
    },
    friends: [{
        type: String,
        ref: 'User'
    }],
    created: {
        default: Date.now(),
        type: Date
    }
});
/*
 
 */
userSchema.statics.findUserAndAddRoom = function(room, party, cb) {
    if (!party) {
        party = [room.room.host];
    }
    if (!(party instanceof Array)) {
        party = party.split(',');
    }
    this.find({
        _id: {
            $in: party
        }
    })
        .exec(function(err, users) {
            if (err) {
                cb(err);
            } else {
                var user;
                if(party.length == 1 && users.length == 0){
                    cb({message:"Aborted: User-id " + party[0] +" not in database"});
                    return false;
                }
                var status;
                for (var i = 0; i < users.length; i++) {
                    status = 0;
                    user = users[i];
                    if (user._id == room.room.host) {
                        user.rooms.hosting.addToSet(room._id);
                        status = 1;
                    }
                    room.room.participants.addToSet({
                        user: user._id,
                        availability: [], // fill with weekly unavailability
                        status: status
                    });
                    user.rooms.participating.addToSet(room._id);
                    user.save();
                }
                room.save();
                cb({
                    message: 'success'
                })
            }
        })
}
userSchema.statics.findUserAndRemoveRoom = function(room, userid, cb) {
    this.findOne({
        _id: userid
    })
        .exec(function(err, user) {

        });
}

module.exports = mongoose.model('User', userSchema);