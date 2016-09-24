"use strict";

var request = require('request')
  , base = 'https://api.purse.io/api/v1/'

var PouchDB = require('pouchdb')
var db = new PouchDB('http://localhost:5984/accounts')

var totp = require('totp-generator');

var pd = require('pretty-data').pd;

var auth = function ( req, res, next ) {
  console.log("authentication initated")

  db.get('altrochepallet_purse', function (dbError, dbResponse) {
    if (new Date().getTime() - dbResponse.timestamp < (4 * 3600 * 1000)) {
      console.log('token.still.valid');
      next();
    } else {
      console.log("db.get: " + pd.json(dbError || dbResponse));
      res.locals = {
        _rev: dbResponse._rev,
        service: dbResponse.service,
        data: dbResponse,
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
    if (!loginError && loginResponse.statusCode == 200) {
      db.put({
        _id: res.locals.user + '_' + res.locals.service,
        _rev: res.locals._rev,
        data: res.locals,
        auth: {
          token: loginBody.token,
          timestamp: new Date().getTime()
        }
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

module.exports.auth = auth
