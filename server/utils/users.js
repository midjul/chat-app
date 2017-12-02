class Users {
  constructor() {
    this.users = [];
  }

  addUsers(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    return this.users.filter((user, index) => {
      if (user.id === id) {
        this.users.splice(index, 1);
        return user;
      }
    })[0];
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    return this.users
      .filter((user, index) => user.room === room)
      .map(user => user.name);
  }

  getRoomList() {
    return [...new Set(this.users.map(user => user.room))];
  }
}

module.exports = { Users };
