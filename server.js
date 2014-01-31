var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

app.listen(process.env.PORT || 8082);

function handler (req, res) {
  res.writeHead(200);
  res.end("This is a Socket IO backend for a real time location sharing service.\n");
}

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1)
});

io.sockets.on('connection', function (socket) {
  socket.on('location', function (data) {
    io.sockets.emit('location', data);
  });
});