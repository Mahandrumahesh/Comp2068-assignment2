/**
 * Created by hpuser on 2017-03-29.
 */
var mongoose = require('mongoose');

// this is needed to tell the app this model is for managing user accounts; it is not a regular model like book
var passportlocalmongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

// create the schema.  username and password are automatically included
var accountSchema = new mongoose.Schema({});

// enable plm on this model
accountSchema.plugin(passportlocalmongoose);
accountSchema.plugin(findOrCreate);


// make the model public
module.exports = mongoose.model('Account', accountSchema);