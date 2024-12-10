const express = require('express');
const app = express();
const socketio = require('socket.io');
const Room = require('./classes/Room');

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000);
const io = socketio(expressServer);

app.set('io', io);

//a way to change an ns (without building a huge UI)
app.get('/change-ns', (req, res) => {
  //update namespaces array
  namespaces[0].addRoom(new Room(0, 'Deleted Aricles', 0));
  io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
  res.json(namespaces[0]);
});

io.use((socket, next) => {
  const jwt = socket.handshake.query.jwt;
  //check jwt
  if (1) {
    next();
  } else {
    console.log('Goodbye');
    socket.disconnect();
  }
});

io.on('connection', (socket) => {
  const userName = socket.handshake.query.userName;
  const jwt = socket.handshake.query.jwt;

  socket.emit('welcome', 'welcome');
  socket.on('clientConnect', (data) => {
    console.log(socket.id, 'has connected');
    socket.emit('nsList', namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    socket.on('joinRoom', async (roomObj, ackCallback) => {
      //need to fetch the history
      const thisNs = namespaces[roomObj.namespaceId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );
      const thisRoomHistory = thisRoomObj.history;

      //leave all rooms, because the client can only be in one room
      const rooms = socket.rooms;

      let i = 0;
      rooms.forEach((room) => {
        //we don't want to leave the socket's personal room which is guaranteed to be first
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      //join the room!
      // roomTitle is coming from the client. Which is NOT safe.
      // Auth to make sure the socket has right to be in that room

      socket.join(roomObj.roomTitle);

      //fetch the number of sockets in this room
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      const socketsCount = sockets.length;

      ackCallback({ numUsers: socketsCount, thisRoomHistory });
    });

    socket.on('newMessageToRoom', (msg) => {
      //broadcast this to all the connected clients... this room only!
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1]; //this is a set!! Not array
      //send out this messageObj to everyone including the sender
      io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', msg);
      //add this message to this room's history
      const thisNs = namespaces[msg.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      thisRoom.addMessage(msg);
    });
  });
});
