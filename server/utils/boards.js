const { Chess } = require("chess.js");
const User = require("../models/User");
let boards = [];
let chess = new Chess();

function newBoard(room) {
  if (!boards.map((x) => x.room).includes(room)) {
    const board = new Chess();
    boards.push({ room: room, board: board });
  }
}
function move(msg, room) {
  getCurrentBoard(room).board.move({
    from: msg.sourceSquare,
    to: msg.targetSquare,
    promotion: "q",
  });
}
function getCurrentBoard(room) {
  return boards.find((x) => x.room === room);
}
function undoMove(room) {
  getCurrentBoard(room).board.undo();
}
function newGame(room) {
  getCurrentBoard(room).board.reset();
}
async function addPoints(winner) {
  try {
    const user = await User.findOne({ username: winner.username });
    user.rank = user.rank + 5
    await user.save();
  } catch (err) {
      console.log(err)
  }
}
async function oddPoints(loser) {
    try {
      const user = await User.findOne({ username: loser.username });
      user.rank = user.rank - 5
      await user.save();
    } catch (err) {
        console.log(err)
    }
  }

function timer() {

}

module.exports = {
  newBoard,
  move,
  getCurrentBoard,
  newGame,
  undoMove,
  addPoints,
  oddPoints
};
