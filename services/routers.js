var express = require('express')
  , app = express()
  , router = express.Router()
  , request = require('request')
  , pd = require('pretty-data').pd

var addService = require('./middlewares/add').addService

router.all('/add', addService, function (req, res) {
  console.log("routers./services/add");
  res.redirect('/services/list');
});

router.get('/list', function (req, res) {
  console.log("routers./services/list")
  res.send('Accounts list')
});

module.exports =  router;
