

var express = require('express');
var app = express(); 
var http = require('http');
var fs = require('fs');
var server = http.createServer(app);
var { Server } = require("socket.io");
var io = new Server(server);
const allusers = new Map();

app.get('/', function (req, res){ // retrieves test.html and displays it on end user screen
  return res.sendFile(__dirname + "/chatroom.html");
});

server.listen(8080, () => {
  console.log("listening on port 8080");
});


// all socket methods will be done in within the io.on("connection") method
io.on('connection', (socket) => { // bind a client with a socket
  console.log(`server received: ${socket.id}`);
  socket.on('disconnect', () => { // if a client disconnects
    console.log('user disconnected');
  });

  // if server receives a chat message socket, prints it on all end user screen
  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      sentChat: `${allusers.get(socket.id)}: ${msg}`,
      whoSent: socket.id
    });  // pass to every client to read the message
    
  });

  socket.on('name', (uname) => {
    allusers.set(socket.id, uname);
    io.emit('name', {socketid: socket.id, name: uname});
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

});





