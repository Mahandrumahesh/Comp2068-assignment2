/**
 * Created by hpuser on 2017-03-27.
 */
// reference mongoose
"use strict";
var mongoose = require('mongoose');

// create player schema (class)
var playerSchema = new mongoose.Schema({
    Team:{
        type: String,
        required: 'Team is required'
    },
    PlayerName: {
        type: String,
        required: 'Name is required'
    },
    BattingPosition: {
        type: String,
        required: 'Position is required'
    },
    PlayerNumber: {
        type: Number,
        min: 1
    },

});

// make it public
module.exports = mongoose.model('Player', playerSchema);
