var express = require('express');
var Router = express.Router();

// move later to a metadata file
var metadata = {
	app_version: "0.0.1",
	api_version: "0.0.1",
	authors: [{
		name: "khauri mcclain",
		nickname: "kmart",
		email: "",
		role: "lead"
	}]
};

Router.route('/').get(function(req,res,next){
	res.json({message:"Hello World"});
});


module.exports = Router;