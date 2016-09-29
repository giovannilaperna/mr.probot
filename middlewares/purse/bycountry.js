"use strict";

var _ = require('underscore')

var bycountry  = function (req, res, next) {
  res.locals = {
    total: res.locals.count_total,
    count: res.locals.results.length,
    results: _.groupBy(_.sortBy(res.locals.results, function(item) {
      return item['exchange_price']
    }), function(group) {
      return group.pricing.country
    })
  }
  next();
}

module.exports.bycountry = bycountry;
