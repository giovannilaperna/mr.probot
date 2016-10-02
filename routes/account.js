"use strict";

var express = require('express')
  , router = express.Router()
  , bodyParser = require('body-parser');

router.use(express.static('public'));

var auth = require('../middlewares/account/auth').auth;
var db = require('../models/account/account');
var form = require('../middlewares/account/form').structure;

router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/add', form, function(req, res) {
  res.render( "template", res.locals);
});

router.post('/add', function(req, res) {
  auth(req.body, function(cb_auth) {
    if (cb_auth.errors === "untested") {
      console.log('login untested');
      db.put(req.body, function (cb_put) {
        res.send(cb_put)
      })
    }
    if (cb_auth.errors === undefined) {
      console.log('login successfull');
      req.body.token = cb_auth.token
      db.put(req.body, function (cb_put) {
        res.send(cb_put)
      })
    } else {
      console.log('login failure');
      res.send(cb_auth)
    }
  });
});

router.get('/edit/:id', function(req, res) {
  res.render( "form", form);
});

router.post('/edit/:id', function(req, res) {
});

router.post('/delete/:id', function(req, res) {
});

router.post('/hide/:id', function(req, res) {
});

router.get('/list', function (req, res) {
  db.getAll(function (cb){
    res.send(cb);
  });
});

module.exports =  router;
