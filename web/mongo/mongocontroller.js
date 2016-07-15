var mongoose = require('mongoose');
var url = 'mongodb://admin:password@ds011495.mlab.com:11495/squadup';

function connect(cb){
	mongoose.connect(url,function(err, db){
		if (err) {
	        console.log(err);
	    } else {
	        console.log("Successfully Connected to Mongodb: " + url.substring(url.indexOf('@')+1));
	        if(typeof cb == "function"){
	        	cb();
	        }
	    }
	});
}


module.exports = {
	connect:connect,
	url: url
};