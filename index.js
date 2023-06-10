const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const auth = require('./auth');
const session = require('express-session');

app.use(session({
  secret: 'some-secret-key',
  resave: false,
  saveUninitialized: true,
}));

const chatHistory = [];

app.get('/', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/login', auth.login);

app.get('/logout', auth.logout);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.emit('chat history', chatHistory);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  
  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    chatHistory.push(msg);
    io.emit('chat message', msg);
  });
});

const port = 3000; // You can change this to any port you prefer
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
