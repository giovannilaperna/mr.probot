"use strict";

var express = require('express');
var app = express();
var middleware = require('./purse_middleware')
var pi =  middleware.pi

var request = require('request');
var _ = require('underscore');
var consolidate = require('consolidate');

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/purse/all/:country', pi.all, pi.html, function (req, res) {
  res.render( "purse_table", res.locals );
});

app.get('/purse/fast/:country', pi.all, pi.fast, pi.html, function (req, res) {
  res.render( "purse_table", res.locals );
});

app.get('/purse/api/all', pi.all, function (req, res) {
    res.json(res.locals)
  });

app.get('/purse/api/all/bycountry', pi.all, pi.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/all/:country', pi.all, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast', pi.all, pi.fast, pi.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast/bycountry', pi.all, pi.fast, pi.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast/:country', pi.all, pi.fast, function (req, res) {
  res.json(res.locals)
});

/*
app.get('/api/order/:id', function (req, res, next) {
  request({
    method: 'GET',
    url: base + 'order/' + req.params.id,
    headers: options,
    json: true
  }, function(error, response, body){
    res.json(body);
  });
});

app.get('/api/rates', function (req, res, next) {
  request({
    method: 'GET',
    url: base + 'btc/rates',
    headers: options,
    json: true
  }, function(error, response, body){
      res.json(body);
  });
});

app.get('/api/rates/:curr', function (req, res, next) {
  request({
    method: 'GET',
    url: base + 'btc/rates',
    headers: options,
    json: true
  }, function(error, response, body){
      res.json(body[req.params.curr]);
  });
});

app.get('/api/me', function (req, res, next) {
  request({
    method: 'GET',
    url: base + 'users/me',
    headers: options,
    json: true
  }, function(error, response, body){
      res.json(body);
  });
});
*/

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
