const express = require('express');
const user = express.Router();
const User = require('../models/users.js');

user.get('/new', (req, res) => {
  res.render('users/new.ejs');
});

user.post('/', (req, res) => {
  User.create(req.body, (error, createdUser) => {
    if(error){
      console.log(error);
    } else {
      console.log(createdUser);
      res.redirect('/');
    };
  });
});

module.exports = user;
