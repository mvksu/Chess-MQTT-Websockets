const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}
function getCurrentUser(id) {
  return users.find((x) => x.id === id);
}

function userLeave(id) {
  return users.filter((x) => x.id === id)[0];
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
