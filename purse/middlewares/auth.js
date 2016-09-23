"use strict";

var request = require('request')
  , base = 'https://api.purse.io/api/v1/'

var PouchDB = require('pouchdb')
var db = new PouchDB('http://localhost:5984/credentials')

var totp = require('totp-generator');

var pd = require('pretty-data').pd;

var login = function ( req, res, next ) {
  console.log("login initated")

  db.get('altrochepallet_purse', function (dbError, dbResponse) {
    if (new Date().getTime() - dbResponse.timestamp < (4 * 3600 * 1000)) {
      console.log('token.still.valid');
      next();
    } else {
      console.log("db.get: " + pd.json(dbError || dbResponse));
      res.locals = {
        _rev: dbResponse._rev,
        service: dbResponse.service,
        user: dbResponse.user,
        email: dbResponse.email,
        password: dbResponse.password,
        twofactor: dbResponse.twofactor
      };
      request({
        json: true,
        method: 'POST',
        url: base + 'auth',
        timeout: 3000,
        body: {
          "username": dbResponse.email,
          "password": dbResponse.password,
          "2fa" : totp(dbResponse.twofactor),
          "noToken": true
        }
      }, loginResponse );
    }
  });

  function loginResponse (loginError, loginResponse, loginBody) {
    console.log("login.response: " + pd.json(loginError || loginResponse))
    if (!error && response.statusCode == 200) {
      db.put({
        _id: res.locals.user + '_' + res.locals.service,
        _rev: res.locals._rev,
        service: res.locals.service,
        user: res.locals.user,
        email: res.locals.email,
        password: res.locals.password,
        twofactor: res.locals.twofactor,
        token: loginBody.token,
        timestamp: new Date().getTime()
      }, function (dbError, dbResponse) {
        console.log("db.put: " + pd.json(dbError || dbResponse));
        next();
      });
    } else {
      res.locals = {
        error: body
      };
      next();
    }
  }

}

module.exports.login = login
