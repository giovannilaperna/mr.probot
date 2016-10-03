"use strict";

var express = require('express')
  , app = express()
  , consolidate = require('consolidate')
  , path = require('path')
  , port = process.env.PORT || 3000;

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static('public'));

var errorhandler = require('errorhandler');

// app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', path.join(__dirname + '/views'));

var sidebar = require('./middlewares/side').sidebar;

app.use('/', sidebar, function(req, res, next) {
  next();
});

app.use('/account', require('./routes/account'));

app.use('/purse', require('./routes/purse'));

app.get('/', function (req, res) {
  res.render( "template", res.locals);
});

if ('development' == app.get('env')) {
  app.use(errorhandler());
}

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
