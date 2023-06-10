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

app.get('/username', (req, res) => {
  console.log("Username query: " + req.session.user.username)
  if (req.session.user && req.session.user.username) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
})

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

  socket.on('getusername', () => {
    console.log("Get username request: ", session.user.username);
  })
});

const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
