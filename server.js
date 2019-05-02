// DEPENDENCIES //
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
require('dotenv').config();
const app = express ();
const db = mongoose.connection;
const PORT = process.env.PORT || 3000;

// DATABASE //
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/intouchapp';

// CONNECT TO MONGO //
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// ERROR / SUCCESS //
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// OPEN CONNECTION TO MONGO //
db.on('open' , ()=>{});

// MIDDLEWARE //
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// ROUTES //
app.get('/' , (req, res) => {
  res.render('index.ejs');
});

// LISTENER //
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
