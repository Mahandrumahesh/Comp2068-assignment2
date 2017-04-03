/**
 * Created by hpuser on 2017-03-21.
 */
"use strict";
// express setup
var express = require('express');
var router = express.Router();

// link to the book model for CRUD operations
var Player = require('../models/player');

// auth check
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // user is logged, so call the next function
    }
    res.redirect('/'); // not logged in so redirect to home
}

/* GET Players main page */
router.get('/', function(req, res, next) {

    // use mongoose model to query mongodb for all players
    Player.find(function(err, players) {
        if(err){
            console.log(err);
            res.end(err);
            return;
        }

        // no error so send the players to the index view
        res.render('players/index', {
            title: 'Players',
            players: players,
            user: req.user
        });
    });
});

// GET /players/add - show blank add form
router.get('/add', isLoggedIn, function(req, res, next) {
    // show the add form
    res.render('players/add', {
        title: 'Players Details',
        user: req.user
    });
});


router.post('/add',isLoggedIn, function(req, res, next) {
    // use Mongoose to populate a new Book
    Player.create({
        Team: req.body.Team,
        PlayerName: req.body.PlayerName,
        BattingPosition: req.body.BattingPosition,
        PlayerNumber: req.body.PlayerNumber
    }, function(err, player) {
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        res.redirect('/players');
    });
});

// GET /players/delete/_id - delete and refresh the index view
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
    // get the id parameter from the end of the url
    var _id = req.params._id;

    // use Mongoose to delete
    Player.remove({ _id: _id }, function(err) {
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        res.redirect('/players');
    });
});

// GET /players/_id - show edit page and pass it the selected book
router.get('/:_id', isLoggedIn, function(req, res, next) {
    // grab id from the url
    var _id = req.params._id;

    // use mongoose to find the selected book
    Player.findById(_id, function(err, player) {
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        res.render('players/edit', {
            player: player,
            title: 'Player Details',
            user: req.user
        });
    });
});

// POST /players/_id - save the updated book
router.post('/:_id', isLoggedIn, function(req, res, next) {
    // grab id from url
    var _id = req.params._id;

    // populate new book from the form
    var player = new Player({
        _id: _id,
        Team: req.body.Team,
        PlayerName: req.body.PlayerName,
        BattingPosition: req.body.BattingPosition,
        PlayerNumber: req.body.PlayerNumber
    });

    Player.update({ _id: _id }, player,  function(err) {
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        res.redirect('/players');
    });
});


// make this file public
module.exports = router;