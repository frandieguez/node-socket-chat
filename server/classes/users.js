class Users {

  constructor() {
    this.people = [];
  }

  addPerson(id, name, chat) {
    let person = {
      id,
      name,
      chat
    }

    this.people.push(person);

    return this.getPeopleByChat(chat);
  }

  getPerson( id ) {
    return this.people.filter(person => person.id == id)[0];
  }

  getPeople() {
    return this.people;
  }

  getPeopleByChat( chat ) {
     return this.people.filter(person => person.chat == chat)
  }

  kickoffPeople(id) {
    let deletedPerson = this.getPerson(id);

    this.people = this.people.filter(person => person.id != id);

    return deletedPerson;
  }
}

module.exports = { Users }
