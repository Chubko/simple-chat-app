const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8001);
const io = socketio(expressServer);

io.of('/').on('connection', (socket) => {
  socket.join('chat');
  io.of('/').to('chat').emit('welcomeToChatRoom', {});
  io.of('/').to(socket.id).emit('socketCheck', socket.id);
  // io.of('/').to('chat').to('chat2').to('adminChat').emit('welcomeToChatRoom',{});
  io.of('/admin').emit('userJoinedMainNS', '');

  socket.on('newMessageToServer', (data) => {
    io.of('/').emit('newMessageToClients', { text: data.text });
  });
});

io.of('/admin').on('connection', (socket) => {
  // io.of('/admin').emit('messageToClientsFromAdmin', { data: 'hi from admin' });
  io.of('/admin').to('chat').emit('welcomeToChatRoom', {});
});
