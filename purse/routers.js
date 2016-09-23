var express = require('express')
  , app = express()
  , router = express.Router()
  , request = require('request')
  , _ = require('underscore')
  , pd = require('pretty-data').pd

var login = require('./middlewares/auth').login
  , orders = require('./middlewares/orders').orders
  , bycountry = require('./middlewares/bycountry').bycountry
  , fast = require('./middlewares/fast').fast
  , html = require('./middlewares/html').html
  , me = require('./middlewares/me').me

router.get('/all/:country', orders, html, function (req, res) {
  res.render( "../purse/views/orders", res.locals );
});

router.get('/fast/:country', orders, fast, html, function (req, res) {
  res.render( "../purse/views/orders", res.locals );
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

router.get('/api/me', login, me, function (req, res) {
  console.log("routers./purse/api/me")
  res.status(200).send(res.locals);
});

module.exports =  router;
