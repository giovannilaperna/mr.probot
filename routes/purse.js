"use strict";

var express = require('express')
  , router = express.Router();

router.use(express.static('public'));

var auth = require('../middlewares/purse/auth').auth
  , orders = require('../middlewares/purse/orders').orders
  , bycountry = require('../middlewares/purse/bycountry').bycountry
  , fast = require('../middlewares/purse/fast').fast
  , html = require('../middlewares/purse/html').html
  , me = require('../middlewares/purse/me').me

router.get('/all/:country', orders, html, function (req, res) {
  res.render( "purse/orders", res.locals );
});

router.get('/fast/:country', orders, fast, html, function (req, res) {
  res.render( "purse/orders", res.locals );
});

router.get('/api/all', orders, function (req, res) {
    res.status(200).send(res.locals)
  });

router.get('/api/all/bycountry', orders, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/all/:country', orders, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast', orders, fast, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/bycountry', orders, fast, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/:country', orders, fast, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/me', auth, me, function (req, res) {
  res.status(200).send(res.locals);
});

module.exports =  router;
