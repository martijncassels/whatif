var passport = require('passport');
// var localStrategy = require('passport-local' ).Strategy;
var Profile = require('../models/profiles');
//var passportLocalMongoose = require('passport-local-mongoose');

//Profile.plugin(passportLocalMongoose);

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
}

exports.partial = function (req, res) {
  var name = req.params.name;
  var sub = req.params.sub
  res.render('partials/'+ sub + '/' + name);
}

exports.register = function(req, res) {
  Profile.register(new Profile({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
}

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
}

exports.logout = function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
}

exports.status = function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
}