"use strict";

var express = require('express')
  , router = express.Router()
  , bodyParser = require('body-parser');

var auth = require('../middlewares/account/auth').auth;
var db = require('../models/account/account');

router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/add', function(req, res) {
  res.render( "account/add");
});

router.post('/add', function(req, res) {
  auth(req.body, function(a) {
    console.log(a);
    if (a.errors === undefined) {
      console.log('login successfull');
      req.body.token = a.token
      db.put(req.body, function (b) {
        res.send(b)
      })
    } else {
      console.log('login failure');
      res.send(a)
    }
  });
});

router.get('/list', function (req, res) {
  res.send('Accounts list')
});

module.exports =  router;
