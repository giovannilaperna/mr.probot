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
  }).catch(function (err) {
    callback(error)
  });
}

//group by service might be wrong
exports.getAll = function (callback) {
  db.allDocs({
    include_docs: true
  }).then(function(response) {
    callback(_.groupBy(response), function(group) {
      return group.service
    })
  }).catch(function (err) {
    callback(error)
  });
}

exports.put = function (data, callback) {
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
      expire: Math.floor(14400 + (new Date().getTime())/1000)
    }).then(function (putResponse) {
      callback(putResponse);
    }).catch(function (putErr) {
      callback(putErr);
    });
  }).then(function(getResponse) {
  }).catch(function (getErr) {
    db.put({
      _id: data.service + "/" + data.username,
      service: data.service,
      username: data.username,
      email: data.email,
      password: data.password,
      twofactor: data.twofactor,
      token: data.token,
      expire: Math.floor(14400 + (new Date().getTime())/1000)
    }).then(function (putResponse) {
      callback(putResponse);
    }).catch(function (putErr) {
      callback(putErr);
    });
  });
}

exports.remove = function (data, callback) {
  db.get(data.service + "/" + data.username).then(function(doc) {
  }).then(function(response) {
    db.remove({
      _id: doc._id,
      _rev: doc._rev,
    });
  }).catch(function (err) {
  });
}
