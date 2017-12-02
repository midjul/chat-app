const expect = require("expect");
const { Users } = require("./users");

describe.only("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      { id: 1, name: "test1", room: "room1" },
      { id: 2, name: "test2", room: "room2" },
      { id: 3, name: "test3", room: "room1" }
    ];
  });
  it("should add new user", () => {
    let user = { id: 0, name: "test", room: "room" };
    let res = users.addUsers(user.id, user.name, user.room);
    expect(res).toEqual(user);
    expect(users.users.length).toBe(4);
  });

  it("should remove a user", () => {
    const rmuser = users.users[2];
    let removed = users.removeUser(3);
    expect(removed).toEqual(rmuser);
    expect(users.users.length).toBe(2);
    expect(users.users).toNotInclude(rmuser);
  });

  it("should not remove a user", () => {
    let removed = users.removeUser(5);
    expect(removed).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it("should get user", () => {
    let found = users.getUser(1);
    expect(found).toEqual(users.users[0]);
    expect(users.users.length).toBe(3);
  });

  it("should not get user", () => {
    let found = users.getUser(5);
    expect(found).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it("should getUserList for room1", () => {
    let found = users.getUserList("room1");
    expect(found.length).toBe(2);
    expect(found).toInclude(users.users[0].name);
    expect(found).toInclude(users.users[2].name);
  });

  it("should getUserList for room2", () => {
    let found = users.getUserList("room2");
    expect(found.length).toBe(1);
    expect(found).toInclude(users.users[1].name);
  });
});
