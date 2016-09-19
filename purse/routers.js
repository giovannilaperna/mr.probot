var express = require('express')
  , app = express()
  , router = express.Router()
  , request = require('request')
  , _ = require('underscore')
  , middleware_all = require('./middlewares/all')
  , all =  middleware_all.all
  , middleware_bycountry = require('./middlewares/bycountry')
  , bycountry =  middleware_bycountry.bycountry
  , middleware_fast = require('./middlewares/fast')
  , fast =  middleware_fast.fast
  , middleware_html = require('./middlewares/html')
  , html =  middleware_html.html

router.get('/all/:country', all, html, function (req, res) {
  res.render( "../purse/views/orders", res.locals );
});

router.get('/fast/:country', all, fast, html, function (req, res) {
  res.render( "../purse/views/orders", res.locals );
});

router.get('/api/all', all, function (req, res) {
    res.status(200).send(res.locals)
  });

router.get('/api/all/bycountry', all, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/all/:country', all, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast', all, fast, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/bycountry', all, fast, bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/:country', all, fast, function (req, res) {
  res.status(200).send(res.locals)
});

module.exports =  router;
