// DEPENDENCIES //
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server, {
  pingTimeout: 60000 // chrome was causing idle errors
});
const $ = require('jquery');
const userController = require('./controllers/users.js');
const sessionsController = require('./controllers/sessions.js');
const session = require('express-session');
const User = require('./models/users.js');
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

// SOCKET IO CONNECTION //
const connectedUsers = [];
io.on('connection', (socket)=>{
  console.log('New user connected');
  console.log(socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  socket.on('chat message', (data)=>{
    console.log('getting message on server');
    let newMessage = {
      name: data.name,
      message: data.message,
      room: data.room
    };
    Message.create(newMessage, (error, createdMessage)=>{
      console.log(newMessage);
    });
    socket.broadcast.emit('emitting', (data));
  });
});

// ROUTES //
app.get('/' , (req, res) => {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});

app.get('/app', (req, res) => {
  if(req.session.currentUser){
    Message.find({'room': 'main chat'}, (error, allMessages)=> {
      res.render('app/index.ejs', {
        messages: allMessages,
        user: req.session.currentUser
      });
      console.log(req.session.currentUser._id);
    });
  } else {
    res.redirect('/sessions/new');
  };
});

app.get('/app/development', (req, res) => {
  if(req.session.currentUser){
    Message.find({'room': 'development'}, (error, allMessages)=> {
      res.render('app/development.ejs', {
        messages: allMessages,
        user: req.session.currentUser
      });
      console.log(req.session.currentUser._id);
    });
  } else {
    res.redirect('/sessions/new');
  };
});

// app.post('/app', (req, res)=>{
//   let newMessage = {
//     name: req.session.currentUser.username,
//     message: req.body.message
//   };
//   Message.create(newMessage, (error, createdMessage)=>{
//     console.log(newMessage);
//     res.redirect('/app');
//   });
// });

// LISTENER //
// app.listen(PORT, () => console.log( 'Listening on port:', PORT));
server.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
});
