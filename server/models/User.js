const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  id: { type: String, unique: true },
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  rank: {
    type: Number,
    min: 0,
    default: 1000,
  },
  role: { type: String, default: "noob" },
  registeredAt: { type: Date, default: () => new Date() },
  lastSeen: { type: Date },
  matchPlayed: { type: Number, default: 0 },
});

module.exports = model("Users", userSchema);
