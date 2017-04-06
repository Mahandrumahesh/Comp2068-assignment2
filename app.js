var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var formidable = require('formidable');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport dependencies
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
// reference the books controller we created
var players = require('./routes/players');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
var conn = mongoose.connection;

// link to config file
var globals = require('./config/globals');

conn.open(globals.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport and sessions
app.use(session({
    secret: 'some salt value here',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// link to the new Account model
var Account = require('./models/account');
passport.use(Account.createStrategy());

// facebook auth
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: globals.facebook.clientID,
        clientSecret: globals.facebook.clientSecret,
        callbackURL: globals.facebook.callbackURL,
        profileFields: [
            'id', 'displayName', 'emails'
        ]
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        Account.findOrCreate({username: profile.emails[0].value}, function (err, user) {
            return cb(err, user);
        });
    }
));

// google authentication
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
        clientID:     globals.google.clientID,
        clientSecret: globals.google.clientSecret,
        callbackURL: globals.google.callbackURL,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return done(err, user);
        });
    }
));


// manage user login status through the db
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', index);
app.use('/users', users);
app.use('/players', players); // handle all requests at /books with books router

app.post('/upload', function(req, res){

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error' , {
        title: 'COMP2068 - Players',
        user: req.user
    });
});

module.exports = app;
