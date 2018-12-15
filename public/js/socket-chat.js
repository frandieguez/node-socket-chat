var socket = io();

var params = new URLSearchParams(window.location.search);

// Check user input
if (!params.has('name')|| !params.has('chat')) {
  window.location = '/';

  throw new Error('Name and chat is required');
}

var user = {
  name: params.get('name'),
  chat: params.get('chat')
}

// Handling when connected to server
socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('chat.enter', { user: user }, function(resp) {
    console.log('Chat enter: ', resp);
    renderUsers(resp.people)
  });
});

// Handling when browser disconnects
socket.on('disconnect', function() {
  console.log('Lost connection with server');
});

// Handling chat people connected
socket.on('people.list', function(message) {
  console.log('People list:', message);
  renderUsers(message.people)
})

// Handling message reception
socket.on('message.chat', function(resp) {
  console.log('Public message:', resp);
  renderMessage(resp, false)
  scrollBottom();
});
