var mongoose = require('mongoose');
var shortid = require('shortid');

var userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    info: {
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
                if (party.length == 1 && users.length == 0) {
                    cb({
                        message: "Aborted: User-id " + party[0] + " not in database"
                    });
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

/** Determine if a user is friends with another user or users */
userSchema.methods.isFriendsWith = function(p, cb) {
    if (!p) return false;
    if (p.indexOf(',') != -1) {
        var ids = p.split(','),
            results = {};
        for (var i = 0; i < ids.length; i++) {
            results[ids[i]] = this.friends.indexOf(ids[i]) != -1;
        }
        return results;
    } else {
        return this.friends.indexOf(p) != -1;
    }
}

/** add a friend or friends to the user **/
userSchema.methods.addFriends = function(f, cb) {
    var friends = f.split(',');
    var self = this;
    this.model('User').find({
        _id: {
            $in: friends
        }
    }, function(err, result) {
        if (err) {
            //
        } else {
            var friend;
            for (var i = 0; i < result.length; i++) {
                friend = result[i];
                if (friend._id == self._id) {
                    continue;
                }
                //update later to reflect a request type system
                friend.friends.addToSet(self._id); 
                self.friends.addToSet(friend._id);
                friend.save();
            }
        }
        self.save(cb)
    })
}

/** add or remove friends from the user **/
userSchema.methods.removeFriends = function(f, cb) {
    var friends = f.split('.');
    this.friends.pull(friends)
    this.save(cb);
}

userSchema.methods.addRoom = function(r, hosting) {
    if (hosting) {
        this.rooms.hosting.addToSet(r);
    } else {
        this.rooms.participating.addToSet(r);
    }
    return this;
}

userSchema.methods.removeRoom = function(r) {
    this.rooms.hosting.pull(r);
    this.rooms.participating.pull(r);
    return this;
}

module.exports = mongoose.model('User', userSchema);