"use strict";

var express = require('express')
  , router = express.Router()
  , bodyParser = require('body-parser');

router.use(express.static('public'));

var auth = require('../middlewares/account/auth').auth;
var form = require('../middlewares/account/form').structure;
var db = require('../models/account/account');


router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/add', form, function(req, res) {
  res.locals.title =  req.originalUrl.split('/').join(' > ')
  res.render( "template", res.locals);
});

router.post('/test', function(req, res) {
  auth(req.body, function(cb_auth) {
    var str = Object.keys(req.body).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(req.body[key]);
    }).join('&');
    console.log(cb_auth)
    res.redirect("./add?" + str + "&alert=" + JSON.stringify(cb_auth))
  });
});

router.post('/add', function(req, res) {
  db.put(req.body, function (cb_put) {
    res.send(cb_put)
  })
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

router.get('/:service/:username', function (req, res) {
  db.getOne("account/" + req.params.service + "/" + req.params.username, function (cb){
    res.render('template', {'details': cb, 'title': req.originalUrl.split('/').join(' > ')});
  });
});

router.get('/:service', function (req, res) {
  db.index(req.params.service, function (cb) {
    res.render('template', {'table' : cb, 'title': req.originalUrl.split('/').join(' > ')})
  })
});

router.get('/', function (req, res) {
  db.getAll(function (cb){
    res.render('template', {'table' : cb})
  });
});

module.exports =  router;
