"use strict";

var express = require('express')
  , app = express()
  , consolidate = require('consolidate')
  , path = require('path')
  , port = process.env.PORT || 3000;

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/services', require('./services/routers'));

app.use('/purse', require('./purse/routers'));

app.get('/', function (req, res) {
  res.status(200).send('Listening on port ' + port)
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
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

*/
