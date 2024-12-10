const joinRoom = async (roomTitle, namespaceId) => {
  const ackRes = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', {
    roomTitle,
    namespaceId,
  });
  document.querySelector(
    '.curr-room-num-users'
  ).innerHTML = `${ackRes.numUsers}<span class="fa-solid fa-user"></span>`;
  document.querySelector('.curr-room-text').innerHTML = roomTitle;

  //we get back the room history in the acknowledge as well
  document.querySelector('#messages').innerHTML = '';

  ackRes.thisRoomHistory.forEach((message) => {
    document.querySelector('#messages').innerHTML += buildMessageHtml(message);
  });

  // another way
  // nameSpaceSockets[namespaceId].emit('joinRoom', roomTitle, (ackRes) => {
  //   document.querySelector(
  //     '.curr-room-num-users',
  //   ).innerHTML = `${ackRes.numUsers}<span class="fa-solid fa-user">`
  //   document.querySelector('.curr-room-text').innerHTML = roomTitle
  // })
};
