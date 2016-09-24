"use strict";

var forms = require("forms")
  , fields = forms.fields
  , validators = forms.validators
  , widgets = forms.widgets;

var bodyParser = require('body-parser');

var auth = require('./auth').auth;

var express = require('express')
  , router = express.Router()

var PouchDB = require('pouchdb')
  , db = new PouchDB('http://localhost:5984/accounts');

var pd = require('pretty-data').pd;

var formDefinition = forms.create({
  service: fields.string({
    label: 'Service Provider',
    choices: {
      empty: '',
      amazon: 'Amazon',
      localbitcoins: 'Localbitcoins',
      paysafecard: 'Paysafecard',
      purse: 'Purse.io'
    },
    widget: widgets.select({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    },
    validators: [
      function (form, field, callback) {
        if (field.data === 'empty') {
          callback('select a service provider');
        } else {
          callback();
        }
      }
    ]
  }),
  username: fields.string({
    widget: widgets.text({
      classes: ['input-with-feedback', 'form-control'],
    }),
    errorAfterField: true,
    cssClasses: {
      label: ['control-label'],
      field: ['form-group']
    }
  }),
  email: fields.email({
    required: true,
    label: 'Email',
    widget: widgets.text({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    }
  }),
  password: fields.password({
    required: true,
    label: 'Password',
    widget: widgets.text({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    }
  }),
  twofactor: fields.password({
    label: 'Two Factor Seed',
    widget: widgets.text({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    }
  })
});

var addForm = function ( req, res, next) {

  formDefinition.handle( req, {
    success: function(form){
      db.get(form.data.service + '_' + form.data.username, function (dbGetError, dbGetResponse) {
        auth(form.data, function(a) {
          if ( a.status === 200 ) {
            if (!dbGetResponse) {
              console.log(form.data.service + " account added for user " + form.data.username)
              db.put({
                _id: form.data.service + "_" + form.data.username,
                credentials: form.data,
                auth: {
                  token: a.body.token,
                  expire: Math.floor((a.body.expire_time + new Date().getTime())/1000)
                }
              }, function (dbError, dbResponse) {
                res.send("db.put: " + pd.json(dbError || dbResponse));
                next();
              });
            } else {
              console.log(form.data.service + " account updated for user " + form.data.username)
              db.put({
                _id:  form.data.service + "_" + form.data.username,
                _rev: dbGetResponse._rev,
                credentials: form.data,
                auth: {
                  token: a.body.token,
                  expire: Math.floor((a.body.expire_time + new Date().getTime())/1000)
                }
              }, function (dbError, dbResponse) {
                res.send("db.update: " + pd.json(dbError || dbResponse));
                next();
              });
            }
          } else {
            res.status(a.status).send(a.body)
            next();
          }
        });
      });
    },
    error: function(form){
      console.log("error");
      next();
    },
    empty: function(){
      res.render( "../services/views/add", {
        form: formDefinition.toHTML(),
        method: 'POST'
      });
      next();
    }
  });
}

module.exports.addForm = addForm
