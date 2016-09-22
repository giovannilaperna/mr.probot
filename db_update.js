db.update = function(obj, key, callback) {
 var db = this;
 db.get(key, function (error, existing) {
  if(!error) obj._rev = existing._rev;
  db.insert(obj, key, callback);
 });
}
