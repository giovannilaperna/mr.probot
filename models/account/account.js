"use strict";

var exports = module.exports = {};

var PouchDB = require('pouchdb')
  , db = new PouchDB('http://localhost:5984/accounts');

PouchDB.plugin(require('pouchdb-find'));

var _ = require('underscore')

exports.getOne = function (data, callback) {
  db.get(data).then(function(doc) {
    include_docs: true
    callback(doc)
  }).catch(function (error) {
    callback(error)
  });
}

exports.getAll = function (callback) {
  db.allDocs({
    include_docs: true,
    startkey: "account/1",
    endkey: "account/z"
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
  db.get("account/" + data.service + "/" + data.username).then(function(doc) {
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

/////////////////////////////////////
////////////////// db find //////////
/////////////////////////////////////

exports.find = function (data, callback) {
db.find({
  selector: {'service': data},
  fields: ['username', 'email', 'password', 'twofactor'],
}).then(function (result) {
  callback(result)
}).catch(function (err) {
  callback(err)
});
}

/////////////////////////////////////
///////////////// db index //////////
/////////////////////////////////////

exports.index = function (data,callback) {
  db.createIndex({
  index: {
    fields: ['service'],
  }
}).then(function () {
  db.find({
    selector: {'service': data},
    fields: ['username', 'email', 'password', 'twofactor'],
  }).then(function (result) {
    callback(result)
  }).catch(function (err1) {
    callback(err1)
  });
}).catch(function (err) {
  callback(err)
});
}


/////////////////////////////////////
//////// Query the databse //////////
/////////////////////////////////////

exports.ddoc = function (data, callback) {
  // create a design doc
  var ddoc = {
    _id: 'service/purse',
    views: {
      index: {
        map: function mapFun(doc) {
          if (doc.title) {
            emit(doc.title);
          }
        }.toString()
      }
    }
  }

  // save the design doc
  db.put(ddoc).catch(function (err) {
    if (err.name !== 'conflict') {
      throw err;
    }
    // ignore if doc already exists
  }).then(function () {
    // find docs where title === 'Lisa Says'
    return db.query('index', {
      key: data,
      include_docs: true
    });
  }).then(function (result) {
    callback(results)
  }).catch(function (err) {
    callback(err);
  });
}
