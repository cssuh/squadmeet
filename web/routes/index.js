var express = require('express');
var router = express.Router();
/*  Catch all for all other pages.
	Defers routing to angularjs */
router.route('*')
    .get(function(req, res, next) {
        res.render('index');
    });

module.exports = router;