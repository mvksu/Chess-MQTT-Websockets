const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  room: { type: String },
  username: { type: String },
  text: {  type: String, },
  time: { type: Date, default: () => new Date()}
});

module.exports = model("Messages", messageSchema);
