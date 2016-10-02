"use strict";

var exports = module.exports = {};

var PouchDB = require('pouchdb')
  , db = new PouchDB('http://localhost:5984/accounts');

var _ = require('underscore')

exports.getOne = function (data, callback) {
  db.get(data.service + "/" + data.username).then(function(doc) {
    include_docs: true
  }).then(function(response) {
    callback(response)
  }).catch(function (error) {
    callback(error)
  });
}

//group by service might be wrong
exports.getAll = function (callback) {
  db.allDocs({
    include_docs: true
  }).then(function(response) {
    callback(_.groupBy(response.rows, function(row) { return row.doc.service; }));
  }).catch(function (error) {
    callback(error)
  });
}

exports.put = function (data, callback) {
  if (data.service === "purse") {
    data.expire = Math.floor(14400 + (new Date().getTime())/1000)
  }
  db.get(data.service + "/" + data.username).then(function(doc) {
    db.put({
      _id: doc._id,
      _rev: doc._rev,
      service: data.service,
      username: data.username,
      email: data.email,
      password: data.password,
      twofactor: data.twofactor,
      token: data.token,
      expire: data.expire
    }).then(function (putResponse) {
      callback(putResponse);
    }).catch(function (putError) {
      callback(putError);
    });
  }).then(function(getResponse) {
  }).catch(function (getError) {
    db.put({
      _id: data.service + "/" + data.username,
      service: data.service,
      username: data.username,
      email: data.email,
      password: data.password,
      twofactor: data.twofactor,
      token: data.token,
      expire: data.expire
    }).then(function (putResponse) {
      callback(putResponse);
    }).catch(function (putError) {
      callback(putError);
    });
  });
}

exports.remove = function (data, callback) {
  db.get(data.service + "/" + data.username).then(function(doc) {
    db.remove({
      _id: doc._id,
      _rev: doc._rev,
    });
  }).then(function(response) {
    callback(response);
  }).catch(function (error) {
    callback(error);
  });
}
