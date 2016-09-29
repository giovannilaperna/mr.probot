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

// Form definition
var formService = forms.create({
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
      // If service is not selected, return an error
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
    widget: widgets.password({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    }
  }),
  twofactor: fields.password({
    label: 'Two Factor Seed',
    widget: widgets.password({
      classes: ['input-with-feedback', "form-control"],
    }),
    errorAfterField: true,
    cssClasses: {
        field: ['form-group']
    }
  })
});

function addAccount ( req, res, next) {

  formService.handle( req, {
    // Action on form submit success
    success: function(form){
      // Check if already in database
      db.get(form.data.service + '_' + form.data.username)
      // if in database
      .then(function (doc) {
        // Test the login
        auth(form.data, function(a) {
          // If login success, update the database
          if ( a.status === 200 ) {
            doc.credentials = form.data,
            doc.auth = {
              token: a.body.token,
              expire: Math.floor((a.body.expire_time + new Date().getTime())/1000)
            }
            db.put(doc);
            console.log(form.data.service + " account updated for user " + form.data.username);
            res.status(a.status).send("Account updated");
            next();
          // if login fails, return the error
          } else {
            res.status(a.status).send(a.body);
            next();
          }
        });
      })
      // If not in database
      .catch(function (err) {
        // Test the login
        auth(form.data, function(a) {
          // If login success, add to database
          if ( a.status === 200 ) {
            db.put({
              _id:  form.data.service + "_" + form.data.username,
              credentials: form.data,
              auth: {
                token: a.body.token,
                expire: Math.floor((a.body.expire_time + new Date().getTime())/1000)
              }
            });
            console.log(form.data.service + " account added for user " + form.data.username);
            res.status(a.status).send("Account added");
            next();
          // if login fails, return the error
          } else {
            // res.status(a.status).send(a.body);
            next();
          }
        });
      });
    },
    // Action on form submit error
    error: function(form){
      console.log("form error");
      next();
    },
    // On GET request to the form, render it
    empty: function(){
      res.render( "account/add", {
        form: formService.toHTML(),
        method: 'POST'
      });
      next();
    }
  });
}

module.exports.addAccount = addAccount
