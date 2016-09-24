var express = require('express')
  , app = express()
  , router = express.Router()
  , request = require('request')
  , pd = require('pretty-data').pd

var addForm = require('./middlewares/add').addForm

router.all('/add', addForm, function (req, res) {
});

router.get('/list', function (req, res) {
  console.log("routers./services/list")
});

module.exports =  router;
