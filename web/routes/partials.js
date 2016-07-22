var express = require('express');
var router = express.Router();

/* Render partials for angularjs */
router.route('/:name')
    .get(function(req, res, next) {
        res.render('partials/' + req.params.name);
    })

module.exports = router;