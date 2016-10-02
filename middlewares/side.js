"use strict";

var exports = module.exports = {};

var db = require('../models/account/account');

exports.sidebar = function(req, res, next) {
  db.getAll(function (docs) {
    res.locals.sidebar = {};
    res.locals.sidebar.accounts = docs;
    next();
  })
}
