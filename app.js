"use strict";

var express = require('express');
var app = express();
var middleware = require('./purse_middleware')

var request = require('request');
var _ = require('underscore');
var consolidate = require('consolidate');

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/purse/all/:country', middleware.all, middleware.html, function (req, res) {
  res.render( "purse_table", res.locals );
});

app.get('/purse/fast/:country', middleware.all, middleware.fast, middleware.html, function (req, res) {
  res.render( "purse_table", res.locals );
});

app.get('/purse/api/all', middleware.all, function (req, res) {
    res.json(res.locals)
  });

app.get('/purse/api/all/bycountry', middleware.all, middleware.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/all/:country', middleware.all, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast', middleware.all, middleware.fast, middleware.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast/bycountry', middleware.all, middleware.fast, middleware.bycountry, function (req, res) {
  res.json(res.locals)
});

app.get('/purse/api/fast/:country', middleware.all, middleware.fast, function (req, res) {
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
