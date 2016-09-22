"use strict";

var request = require('request')
  , base = 'https://api.purse.io/api/v1/'

var nano = require('nano')('http://localhost:5984/')
  , db = nano.use('credentials')

var me = function (req, res, next) {

  function requestResults (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.locals = {
        results: body
      };
      next();
    }
  }

  db.get('b5ef8090d1cb44cdda85e88531001181', function(err, body) {
    request({
      json: true,
      method: 'GET',
      url: base + 'users/me',
      headers: {authorization: 'JWT ' + body.token}
    }, requestResults );
  });
}

module.exports.me = me
