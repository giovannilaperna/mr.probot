"use strict";

var exports = module.exports = {};

var request = require('request');
var totp = require('totp-generator');

 exports.auth = function (data, callback) {

  console.log('testing ' + data.service + ' authentication for user ' + data.username);

  if (data.service === 'purse') {
    request({
      json: true,
      method: 'POST',
      url: 'https://api.purse.io/api/v1/' + 'auth',
      timeout: 3000,
      body: {
        "username": data.email,
        "password": data.password,
        "2fa" : totp(data.twofactor),
        "noToken": true
      }
    }, function (err, res, body) {
      callback(body);
    });
  } else {
    data.errors = "untested";
    callback(data);
  }
}
