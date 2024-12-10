// const userName = prompt('What is your name?')
// const userPassword = prompt('What is your password?')
const userName = 'Luda';
const password = 12345;

const clientoptions = {
  query: { userName, password },
  auth: { userName, password },
};

//always join the main namespace, because that's where the client gets the other namespaces from
const socket = io('http://localhost:8000', clientoptions);

//sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

//a global variable we can update when the user clicks on a namespace
//we will use it to broadcast across the app (redux would be great here)
let selectedNsId = 0;

//add a submit handler for our form
document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  //grab the value from the input box
  const newMessage = document.querySelector('#user-message').value;

  nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
    newMessage,
    date: Date.now(),
    avatar: 'https://via.placeholder.com/30',
    userName,
    selectedNsId,
  });
  document.querySelector('#user-message').value = '';
});

// addListeners job is to manage all listeners added to all namespaces.
//this prevents listeneres being added multiples times
const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on('nsChange', (data) => {
      console.log('Namespace changed', data);
    });
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    //add the nsId listener to this namespace
    nameSpaceSockets[nsId].on('messageToRoom', (msg) => {
      document.querySelector('#messages').innerHTML += buildMessageHtml(msg);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on('connect', () => {
  console.log('Connected');

  socket.emit('clientConnect', { data: 'hi from client' });
});

//pull namespaces
socket.on('nsList', (nsData) => {
  const lastNs = localStorage.getItem('lastNs');
  const nameSpaceDiv = document.querySelector('.namespaces');
  nameSpaceDiv.innerHTML = '';
  nsData.forEach((ns) => {
    //update the HTML with each ns
    nameSpaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    //initialize thisNs as its index in nameSpaceSockets.
    //If the connection is new, this will be null
    //If the connection has already been established, it will reconnect and remain in its spot
    if (!nameSpaceSockets[ns.id]) {
      //There is no socket at this nsId. So make a new connection!
      //join this namespace with io()
      nameSpaceSockets[ns.id] = io(`http://localhost:8000${ns.endpoint}`);
    }

    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName('namespace')).forEach(
    (element) => {
      element.addEventListener('click', (e) => {
        joinNs(element, nsData);
      });
    }
  );

  //if lastNs is set, grab that element instead of 0.
  joinNs(document.getElementsByClassName('namespace')[0], nsData);
});
