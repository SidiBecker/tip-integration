var express = require('express');
var session = require('express-session');
var consign = require('consign');
var bodyParser = require('body-parser');
var passport = require('passport');

module.exports = function () {
    var app = express();

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static('public'));
    app.use(session({ secret: '<SOME SECRET HERE>', resave: false, saveUninitialized: false }));

    //app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    consign()
        .include('./src/app/controllers')
        .into(app);

    return app;
}