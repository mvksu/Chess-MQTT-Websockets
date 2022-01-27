const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  name: { type: String, default: "Unnamed Room" },
  owner: { type: Schema.Types.ObjectId, ref: "Users" }, 
  minPerSide: { type: Number, default: 5},
  increment: { type: Number, default: 0 }
});

module.exports = model("Rooms", roomSchema);
