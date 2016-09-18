var express = require('express')
  , app = express()
  , router = express.Router()
  , middleware = require('./middleware')
  , pi =  middleware.pi
  , request = require('request')
  , _ = require('underscore')

router.get('/all/:country', pi.all, pi.html, function (req, res) {
  res.render( "../purse/table", res.locals );
});

router.get('/fast/:country', pi.all, pi.fast, pi.html, function (req, res) {
  res.render( "../purse/table", res.locals );
});

router.get('/api/all', pi.all, function (req, res) {
    res.status(200).send(res.locals)
  });

router.get('/api/all/bycountry', pi.all, pi.bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/all/:country', pi.all, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast', pi.all, pi.fast, pi.bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/bycountry', pi.all, pi.fast, pi.bycountry, function (req, res) {
  res.status(200).send(res.locals)
});

router.get('/api/fast/:country', pi.all, pi.fast, function (req, res) {
  res.status(200).send(res.locals)
});

module.exports =  router;
