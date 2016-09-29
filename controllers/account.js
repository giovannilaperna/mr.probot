var express = require('express')
  , app = express()
  , router = express.Router()
  , request = require('request')
  , pd = require('pretty-data').pd

var addAccount = require('../middlewares/account/add').addAccount

router.all('/add', addAccount, function (req, res) {
  console.log("routers./services/add");
});

router.get('/list', function (req, res) {
  console.log("routers./services/list")
  res.send('Accounts list')
});

module.exports =  router;
