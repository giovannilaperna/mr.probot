"use strict";

var exports = module.exports = {};

exports.structure = function (req, res, next) {
  res.locals = {
    alert: req.query.alert
  }
  res.locals.form = {
  buttons: [
    {
      id: "Test",
      class: "default",
      action: "test",
      method: "POST"
    },
    {
      id: "Save",
      class: "primary",
      action: "add",
      method: "POST"
    }
  ],
  fields: [
      {
        id: "service",
        select: true,
        label: "Provider",
        placeholder: "Choose a service provider",
        value: req.query.service,
        validation: "",
        options: [
          {
            value: "amazon",
            label: "Amazon"
          },
          {
            value: "purse",
            label: "Purse.io"
          },
          {
            value: "localbitcoins",
            label: "Localbitcoins"
          },
          {
            value: "paysafecard",
            label: "Paysafecard"
          }
        ]
      },
      {
        id: "username",
        text: true,
        label: "Username",
        placeholder: "Username",
        value: req.query.username,
        validation: ""
      },
      {
        id: "email",
        text: true,
        label: "Email",
        placeholder: "Email",
        value: req.query.email,
        validation: ""
      },
      {
        id: "password",
        password: true,
        label: "Password",
        placeholder: "Password",
        value: req.query.password,
        validation: ""
      },
      {
        id: "twofactor",
        password: true,
        label: "2FA",
        placeholder: "Two Factor Authentication Seed",
        value: req.query.twofactor,
        validation: ""
      }
  ]
}
next();
}
