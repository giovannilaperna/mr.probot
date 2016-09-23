// init pounchdb
var PouchDB = require('pouchdb');

//create a database
var db = new PouchDB('http://localhost:5984/credentials');

/*
// all databases info
db.info().then(function (info) {
  console.log(info);
})


// destroy the database
db.destroy('credentials').then(function () {
  console.log("database destroied");
}).catch(function (err) {
  // error occurred
})
*/

// put a document
db.put({
  "service": "purse",
  "_id": "altrochepallet_purse",
  "user": "altrochepallet",
  "email": "altrochepallet@gmail.com",
  "password": "THAVlb*maXGLpRz64fdwsy*cH",
  "twofactor": "3CFXIHNMIGEP4LMT"
}, function (err, response) {
  console.log(err || response);
});

/*
// get the document by _id
db.get('altrochepallet_purse').then(function (doc) {
  console.log(doc);
});

// update a document
// fetch mittens
db.get('altrochepallet_purse').then(function (doc) {
  // update their age
  doc.password = "newpassword";
  // put them back
  return db.put(doc);
}).then(function () {
  // fetch mittens again
  return db.get('altrochepallet_purse');
}).then(function (doc) {
  console.log(doc);
});


// destroy the database
db.destroy().then(function () {
  console.log("database destroied");
}).catch(function (err) {
  // error occurred
})
*/
