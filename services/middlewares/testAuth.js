"use strict";

var request = require('request');
var totp = require('totp-generator');

function testAuth ( data, callback ) {

  console.log('testing ' + data.service + 'authentication');

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
      if (loginError) {
        console.log('login failed')
      } else {
        console.log('successful login')
      };
      callback({
        status: loginResponse.statusCode,
        body: ( loginBody || loginError)
      });
    }

  }
  
}

module.exports.testAuth = testAuth
