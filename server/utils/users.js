const User = require("../models/User");

let usersOnline = [];
let usersRoom = [];

async function userHasLoggedIn(username, socketid) {
  usersOnline.push({ username, socketid });
  return usersOnline;
}

async function userHasLoggedOut(socketid) {
  usersOnline = usersOnline.filter((x) => x.socketid !== socketid);
  return usersOnline;
}

function getOnlineUsers() {
  return usersOnline;
}

function userHasJoinedRoom({username, room, socketid}) {
  if (!usersRoom.map(x => x.username).includes(username)) {
    usersRoom.push({ username, room, socketid });
  }
  return usersRoom;
}

async function userExit(socketid) {
  usersRoom = usersRoom.filter(user => user.socketid !== socketid)
  return usersRoom
}

function getRoomUsers(room) {
  return usersRoom.filter((user) => user.room === room);
}


module.exports = {
  userHasLoggedIn,
  userHasLoggedOut,
  getOnlineUsers,
  userHasJoinedRoom,
  userExit,
  getRoomUsers,
};
