"use strict";

var request = require('request')
  , base = 'https://api.purse.io/api/v1/'

var PouchDB = require('pouchdb')
, db = new PouchDB('http://localhost:5984/credentials')

var pd = require('pretty-data').pd;


var me = function (req, res, next) {

  function requestResults (error, response, body) {
    console.log("me.results: " + pd.json(error || body));
    if (!error && response.statusCode == 200) {
      db.get('altrochepallet_purse', function (dbError, dbResponse) {
        db.put({
          _id: dbResponse.user + '_' + dbResponse.service,
          _rev: dbResponse._rev,
          service: dbResponse.service,
          user: dbResponse.user,
          email: dbResponse.email,
          password: dbResponse.password,
          twofactor: dbResponse.twofactor,
          token: dbResponse.token,
          timestamp: dbResponse.timestamp,
          purse: body
        }, function (dbError, dbResponse) {
          console.log("db.put: " + pd.json(dbError || dbResponse));
        });
      });
      res.locals = {
        results: body
      };
      next();
    } else {
      res.locals = {
        error: body
      };
      next();
    }
  }

  db.get('altrochepallet_purse', function (dbError, dbResponse) {
    console.log("db.get: " + pd.json(dbError || dbResponse));
    request({
      json: true,
      method: 'GET',
      url: base + 'users/me',
      headers: {authorization: 'JWT ' + dbResponse.token}
    }, requestResults );
  });
}

module.exports.me = me
