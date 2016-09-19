"use strict";

var request = require('request')
  , _ = require('underscore')
  , base = 'https://api.purse.io/api/v1/'

var all  = function (req, res, next) {

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
      "username": 'altrochepallet@gmail.com',
      "password": 'THAVlb*maXGLpRz64fdwsy*cH',
      "noToken": true
    }
  }, callbackResults );

}

module.exports.all = all;
