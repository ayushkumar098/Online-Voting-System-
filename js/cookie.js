const express = require("express");
const app = express();
const session = require("express-session");
app.use(
  session({
    name: "voter",
    secret: process.env.cookie || "Sectre-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 630000,
      sameSite: "lax",
    },
  })
);

function checkcookie(req, res, next) {
  if (!req.session.voter) {
    req.session.voter = {};
    next();
  } else {
    next();
  }
}

module.export = checkcookie;