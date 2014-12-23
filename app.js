var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numConnections = 0;

io.on('connection', function(socket) {
  numConnections += 1;
  io.emit('numConnections', numConnections);

    socket.broadcast.emit('chat message', {
      name: "Chat Room",
      msg: "Someone connected"
    });

  socket.on('chat message', function(obj) {
    socket.broadcast.emit('chat message', obj);
  });

  socket.on('disconnect', function() {
    numConnections -= 1
    io.emit('numConnections', numConnections);

    socket.broadcast.emit('chat message', {
      name: "Chat Room",
      msg: "Someone disconnected"
    });
  });

});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on port '+port);
});