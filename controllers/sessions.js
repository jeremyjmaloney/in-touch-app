const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs');
});

sessions.post('/', (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if(foundUser){
      if(bcrypt.compareSync(req.body.password, foundUser.password)){
        req.session.currentUser = foundUser;
        res.redirect('/');
      } else {
        res.render('sessions/invalid.ejs');
      };
    } else {
      res.render('sessions/invalid.ejs');
    };
  });
});

sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = sessions;
