"use strict";

var fast  = function (req, res, next) {
  var i;
  for (i = res.locals.results.length - 1; i >= 0; i -= 1) {
    for (let item of res.locals.results[i].items) {
      if ( item['in_stock'] != true || item['offered_by_amazon'] != true) {
        res.locals.results.splice( i , 1 );
        break;
      }
    }
  }
  res.locals.count = res.locals.results.length;
  next();
}

module.exports.fast = fast;
