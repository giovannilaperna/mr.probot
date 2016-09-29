"use strict";

var request = require('request');
var totp = require('totp-generator');

function auth (data, callback) {

  console.log('testing ' + data.service + ' authentication');

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
    }, loginResponse );

    function loginResponse (loginError, loginResponse, loginBody) {
      if (loginBody.errors) {
        console.log('login failed');
        callback({
          status: 401,
          body: (loginBody.detail)
        });
      } else {
        console.log('successful login');
        callback({
          status: 200,
          body: (loginBody)
        });
      };
    }

  }

}

module.exports.auth = auth
