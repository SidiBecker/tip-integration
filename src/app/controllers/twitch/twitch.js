
require('dotenv').config();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request = require('request');
var handlebars = require('handlebars');

module.exports = function (app) {

  app.get('/', function (req, res) {

    if (req.session && req.session.passport && req.session.passport.user) {
      console.log(req.session.passport.user.data[0]);
      debugger
      res.send(template(req.session.passport.user));
    } else {
      res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><button>Login With Twitch</button></a></html>');
    }
  });

  // Set route to start OAuth link, this is where you define scopes to request
  app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

  // Set route for OAuth redirect
  app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/auth/streamlabs', failureRedirect: '/' }));

  // Override passport profile function to get user profile from Twitch API
  OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    var options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
      } else {
        done(JSON.parse(body));
      }
    });
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: process.env.TWITCH_CALLBACK_URL,
    state: true
  },
    function (accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // Securely store user profile in your DB
      //User.findOrCreate(..., function(err, user) {
      //  done(err, user);
      //});

      done(null, profile);
    }
  ));



  // Define a simple template to safely generate HTML with values from user's profile
  var template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table border="1">
    <tr><th>Display Name</th><td>{{data.[0].display_name}}</td></tr>
    <tr><th>Bio</th><td>{{data.[0].description}}</td></tr>
    <tr><th>Image</th><td><img src="{{data.[0].profile_image_url}}"></td></tr>
</table></html>`);

}