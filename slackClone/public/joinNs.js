const joinNs = (element, data) => {
  const nsEndpoint = element.getAttribute('ns');
  const clickeNs = data.find((row) => row.endpoint === nsEndpoint);

  //global so we can submit the new message to the right place
  selectedNsId = clickeNs.id;
  const rooms = clickeNs.rooms;

  //get the room-list div
  let roomList = document.querySelector('.room-list');
  roomList.innerHTML = '';

  //init firstRoom
  let firstRoom;

  //loop through each room, and add it to the DOM
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }

    roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
            <span class="fa-solid fa-${
              room.privateRoom ? 'lock' : 'globe'
            }"></span>${room.roomTitle}
        </li>`;
  });

  //init join first room
  joinRoom(firstRoom, clickeNs.id);

  //add click listener to each room so the client can tell the server it wants to join
  const roomNodes = document.querySelectorAll('.room');

  Array.from(roomNodes).forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const namespaceId = elem.getAttribute('namespaceId');

      joinRoom(e.target.innerText, +namespaceId);
    });
  });

  localStorage.setItem('lastNs', nsEndpoint);
};
