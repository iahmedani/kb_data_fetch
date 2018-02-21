const User = require('../models/user'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use('local', new LocalStrategy({  usernameField: 'email',
passwordField: 'password',
passReqToCallback: true},
  function(req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('warning', 'Incorrect username.'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('warning','Incorrect password.'));
      }
      return done(null, user);
    });
  }
));