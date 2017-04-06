/**
 * Created by hpuser on 2017-03-21.
 */
// array of global variables
module.exports = {
    db: 'mongodb://w2017dba:mahesh1997@ds137340.mlab.com:37340/comp2068-list',  // mlab
    facebook: {
        clientID: '1944680639084904',
        clientSecret: '8690b13596b9fa684eac11a6d33beda4',
        callbackURL: 'http://localhost:3000/facebook/callback'
    },
    //authentication for the google
    google: {
        clientID: '865293236726-uaub0ga32tbmqk2ccju6ll1dp78k5uoq.apps.googleusercontent.com',
        clientSecret: 'pwhFjTVglYTu6WjElVR9WrzY',
        callbackURL: 'http://localhost:3000/google/callback'
    }
};
