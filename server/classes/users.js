class Users {

  constructor() {
    this.people = [];
  }

  addPerson(id, name) {
    let person = {
      id,
      name
    }

    this.people.push(person);

    console.log(this.people);

    return this.people;
  }

  getPerson(id) {
    return this.people.filter(person => person.id == id)[0];
  }

  getPeople() {
    return this.people;
  }

  getPeopleByChat( chat ) {
    // ...
  }

  kickoffPeople(id) {
    let deletedPerson = this.getPerson(id);

    this.people = this.people.filter(person => person.id != id);

    return deletedPerson;
  }
}

module.exports = { Users }
