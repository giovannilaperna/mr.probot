"use strict";

var request = require('request')
  , _ = require('underscore')
  , my_private = require('./credentials')
  , base = 'https://api.purse.io/api/v1/'
  , pi = {};

pi.partials  = function (req, res, next) {
  // somme paziali
}

pi.html  = function (req, res, next) {
  res.locals.countries = [
    {id: "US", name: "United States"},
    {id: "UK", name: "United Kingdom"},
    {id: "CA", name: "Canada"},
    {id: "MX", name: "Mexico"},
    {id: "FR", name: "France"},
    {id: "IT", name: "Italy"},
    {id: "ES", name: "Spain"},
    {id: "JP", name: "Japan"},
    {id: "CN", name: "China"},
    {id: "BR", name: "Brazil"},
    {id: "IN", name: "India"}
  ]
  var i;
  for (i = res.locals.results.length - 1; i >= 0; i -= 1) {
    res.locals.results[i].pricing.fee = res.locals.results[i].pricing.fee.toFixed(2) + " %";
    res.locals.results[i].pricing.current_exchange = res.locals.results[i].pricing.current_exchange.toFixed(2);
    res.locals.results[i].pricing.buyer_pays_fiat = res.locals.results[i].pricing.buyer_pays_fiat.toFixed(2);
  }
  next();
}

pi.bycountry  = function (req, res, next) {
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

pi.fast  = function (req, res, next) {
  var i;
  for (i = res.locals.results.length - 1; i >= 0; i -= 1) {
    for (let item of res.locals.results[i].items) {
      if ( item['in_stock'] != true || item['offered_by_amazon'] != true) {
        res.locals.results.splice( i , 1 );
        break;
      }
    }
  }
  res.locals.count = res.locals.results.length,
  next();
}

pi.all  = function (req, res, next) {

  var i;

  if (req.query.limit !== undefined) { var limit = req.query.limit } else { limit = 50 };
  if (req.query.offset !== undefined) { var offset = req.query.offset } else { offset = 0 };
  if (req.query.amount !== undefined) { var amount = req.query.amount } else { amount = '' };
  if (req.params.country !== undefined) { var country = req.params.country } else { country = '' };
  if (req.query.hide !== undefined) { var hide = req.query.hide } else { hide = '' };

  var callbackCurated = function ( error, resp, body ) {
    for (i = body.results.length - 1; i >= 0; i -= 1) {
      body.results[i].pricing.current_exchange = body.results[i].pricing.buyer_pays_fiat / body.results[i].pricing.buyer_gets_btc;
      body.results[i].pricing.fee = ((body.results[i].pricing.current_exchange / body.results[i].pricing.market_exchange_rate.rate) - 1) * 100;
      if (body.results[i].pricing.market_exchange_rate.fixed == true) {body.results[i].pricing.mode = 'fixed'} else {body.results[i].pricing.mode = 'floating'};
      body.results[i].pricing.reference_rate = body.results[i].pricing.market_exchange_rate.rate;
      delete body.results[i]['pricing']['market_exchange_rate'];
      delete body.results[i]['user_role'];
      delete body.results[i]['spender']['stats']['reviews'];
      delete body.results[i]['state'];
      delete body.results[i]['service'];
      delete body.results[i]['creted_at'];
      delete body.results[i]['unread_messages'];
      delete body.results[i]['buyer_requirements'];
      delete body.results[i]['available_actions'];
    };
    res.locals = {
      total: body.count,
      count: body.results.length,
      results: _.sortBy(body.results, function(item) {
        return item['fee']
      })
    };
    next();
  }

  var callbackResults = function ( error, resp, body) {
    request({
      json: true,
      method: 'GET',
      url: base + 'orders/open?limit=' + limit + '&offset=' + offset + '&country=' + country + '&amount=' + amount + '&hide=' + hide,
      headers: {authorization: 'JWT ' + body.token}
    }, callbackCurated );
  }

  request({
    json: true,
    method: 'POST',
    url: base + 'auth',
    timeout: 3000,
    body: {
      "username": my_private.credentials.purse[0].email,
      "password": my_private.credentials.purse[0].psw,
      "noToken": true
    }
  }, callbackResults );

}
module.exports.pi = pi;
