const { io } = require('../server');
const { Users } = require('../classes/users.js');
const { createMessage } = require('../utils/utils.js');


const users = new Users();

io.on('connection', (client) => {

  client.on('chat.enter', (data, callback) => {
    if (!data.user.name || ! data.user.chat ) {
      return callback({
        err: true,
        message: 'User not valid'
      })
    }

    client.join(data.user.chat);

    let people = users.addPerson(client.id, data.user.name, data.user.chat);

    client.broadcast.to(data.user.chat).emit('people.list', { people: users.getPeopleByChat(data.user.chat) });
    client.broadcast.emit( 'message.chat', createMessage('admin', `${ data.user.name } has joined.`));

    callback({ people, client: client.id });
  })

  client.on('disconnect', () => {
    let person = users.kickoffPeople(client.id);

    console.log('Person disconnected', person)

    client.broadcast.emit(
      'message.chat',
      createMessage('admin', `${ person.name } went away.`)
    );
  })

  client.on('message.public', (data) => {
    let person = users.getPerson(client.id);
    let message = createMessage(person.name, data.message);

    client.broadcast.emit('message.create', message);
  })

  client.on('message.chat', (data, callback) => {
    let person = users.getPerson(client.id);
    let message = createMessage(person.name, data.message);

    console.log(message, person, users.getPeopleByChat(person.chat));

    client.broadcast.to(person.chat).emit('message.chat', message);

    callback(message);
  });

  client.on('message.private', (data) => {
    let person = users.getPerson(client.id);
    let message = createMessage(person.name, data.message);

    client.broadcast.to(data.to).emit('message.private', createMessage(person.name, data.message));
  })

});
