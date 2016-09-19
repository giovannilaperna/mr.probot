"use strict";

var html  = function (req, res, next) {
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

module.exports.html = html;
