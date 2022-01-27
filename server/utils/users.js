const User = require("../models/User");

let usersOnline = [];

async function userHasLoggedIn(username, socketid) {
  usersOnline.push({username, socketid})
  return usersOnline;
}

async function userHasLoggedOut(socketid) {
  usersOnline = usersOnline.filter(x => x.socketid !== socketid);
  return usersOnline
}

function getOnlineUsers() {
  return usersOnline;
}

function getAllUsersOnline() {
  return usersOnline
}

function removeUser(id) {
  return users.filter((x) => x.id !== id)
}

function userLeave(id) {
  return users.filter((x) => x.id === id)[0];
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userHasLoggedIn,
  userHasLoggedOut,
  getOnlineUsers
};
