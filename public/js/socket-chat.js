var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name')) {
  window.location = '/';
  throw new Error('Name is required');
}

var user = {
  name: params.get('name')
}

socket.on('connect', function() {
  console.log('Conectado al servidor');

  socket.emit('chat.enter', { user: user }, function(resp) {
    console.log('Chat enter: ', resp);
  });
});

socket.on('message.create', function(resp) {
  console.log(resp);
})

// escuchar
socket.on('disconnect', function() {
  console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('people.list', function(message) {

  console.log('Servidor:', message);

})

// Escuchar información
socket.on('message.private', function(message) {

  console.log('Private message:', message);

})
