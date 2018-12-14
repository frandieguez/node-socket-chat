const { io } = require('../server');
const { Users } = require('../classes/users.js');
const { createMessage } = require('../utils/utils.js');


const users = new Users();

io.on('connection', (client) => {

  client.on('chat.enter', (data, callback) => {
    console.log(data);

    if (!data.user.name) {
      return callback({
        err: true,
        message: 'User not valid'
      })
    }

    let people = users.addPerson(client.id, data.user.name);

    client.broadcast.emit('people.list', { people: users.getPeople() })

    callback({ people, client: client.id });
  })

  client.on('disconnect', () => {
    let person = users.kickoffPeople(client.id);

    client.broadcast.emit(
      'message.create',
      createMessage('admin', `${ person.name } went away.`)
    );
  })

  client.on('message.create', (data) => {
    let person = users.getPerson(client.id);
    let message = createMessage(person.name, data.message);

    client.broadcast.emit('message.create', message);
  })

  client.on('message.private', (data) => {
    let person = users.getPerson(client.id);
    let message = createMessage(person.name, data.message);

    client.broadcast.to(data.to).emit('message.private', createMessage(person.name, data.message));
  })

});
