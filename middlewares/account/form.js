"use strict";

var exports = module.exports = {};

exports.structure = function (req, res, next) {
  res.locals.form = {
  title: "Add account",
  action: "add",
  button: "Test and Save",
  fields: [
      {
        id: "service",
        select: true,
        label: "Provider",
        placeholder: "Choose a service provider",
        value: "",
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
        value: "",
        validation: ""
      },
      {
        id: "email",
        text: true,
        label: "Email",
        placeholder: "Email",
        value: "",
        validation: ""
      },
      {
        id: "password",
        password: true,
        label: "Password",
        placeholder: "Password",
        value: "",
        validation: ""
      },
      {
        id: "twofactor",
        password: true,
        label: "2FA",
        placeholder: "Two Factor Authentication Seed",
        value: "",
        validation: ""
      }
  ]
}
next();
}
