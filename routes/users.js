var express = require('express');
var router = express.Router();

// link to your existing Account model
var Account = require('../models/account');

// auth check
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // user is logged, so call the next function
    }
    res.redirect('/'); // not logged in so redirect to home
}

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    Account.find( function(err, accs) {
        if (err) {
            res.render('error', { title: 'User Retrieval Error'});
        }
        else {
            res.render('users', {
                title: 'Users',
                user: null,
                useraccs: accs
            });
        }
    });
});

module.exports = router;
