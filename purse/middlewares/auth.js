"use strict";

var request = require('request')
  , base = 'https://api.purse.io/api/v1/'

var nano = require('nano')('http://localhost:5984/')
  , db = nano.use('credentials')

  var totp = require('totp-generator');

  db.update = function(obj, key, callback) {
   var db = this;
   db.get(key, function (error, existing) {
    if(!error) obj._rev = existing._rev;
    db.insert(obj, key, callback);
   });
  }

var login = function ( req, res, next ) {

  db.get('b5ef8090d1cb44cdda85e88531001181', function(err, body) {
    res.locals = {mil: body.mil,
      urs: body.usr,
      psw: body.psw,
      two: body.two
    };
    request({
      json: true,
      method: 'POST',
      url: base + 'auth',
      timeout: 3000,
      body: {
        "username": body.mil,
        "password": body.psw,
        "noToken": true,
        "2fa" : totp(body.two)
      }
    }, loginResponse );
  });

  function loginResponse (error2, response2, body2) {
    db.update({
      timestamp: new Date().getTime(),
      token: body2.token,
      usr: res.locals.usr,
      mil: res.locals.mil,
      psw: res.locals.psw,
      two: res.locals.two
    }, 'b5ef8090d1cb44cdda85e88531001181', function(err3, body3) {
    next();
    })
  }
}

module.exports.login = login
