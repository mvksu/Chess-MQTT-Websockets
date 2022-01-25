const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  text: { type: String, minLength: 1},
  author: { type: Schema.Types.ObjectId, ref: "Users"},
  receiver: { type: Schema.Types.ObjectId, ref: "Users"},
  date: { type: Date, default: () => new Date()}
});

module.exports = model("Comments", commentSchema);
