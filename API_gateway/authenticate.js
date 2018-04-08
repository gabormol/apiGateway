var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./models/user');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.google = passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ OauthId: profile.id }, function(err, user) {
        if(err) {
          console.log(err); // handle errors!
        }
        if (!err && user !== null) {
          done(null, user);
        } else {
            console.log(profile);
            user = new User({
                username: profile.displayName
              });
              user.OauthId = profile.id;
              user.OauthToken = accessToken;
              user.save(function(err) {
                if(err) {
                  console.log(err); // handle errors!
                } else {
                  console.log("saving user ...");
                  done(null, user);
                }
              });
        }
      });
    }
  ));



