// DEPENDENCIES //
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
require('dotenv').config();
const app = express();
const userController = require('./controllers/users.js');
const sessionsController = require('./controllers/sessions.js');
const session = require('express-session');
const Message = require('./models/messages.js');

// CONNECTIONS //
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
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use('/users', userController);
app.use('/sessions', sessionsController);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// ROUTES //
app.get('/' , (req, res) => {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});

app.get('/app', (req, res) => {
  Message.find({}, (error, allMessages)=> {
    console.log(allMessages);
    res.render('app/index.ejs', {
      messages: allMessages
    });
  });
});

app.post('/app', (req, res)=>{
  Message.create(req.body, (error, createdMessage)=>{
    res.redirect('/app');
  });
});

app.get('/app', (req, res) => {
  if(req.session.currentUser){
    res.render('app/index.ejs');
  } else {
    res.redirect('/sessions/new');
  };
});

// LISTENER //
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
