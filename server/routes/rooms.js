const router = require("express").Router();
const Room = require("../models/Room");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id }).populate("owner");
    res.send(room);
  } catch (err) {
    console.log(err);
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.name }).populate("owner");
    res.send(room);
  } catch (err) {
    console.log(err);
  }
});

router.post("/:owner", async (req, res) => {
  const { name, minPerSide, increment } = req.body;
  try {
    const owner = await User.findOne({ username: req.params.owner });
    const comment = await Room.create({
      name: name,
      owner: owner,
      minPerSide: minPerSide,
      increment: increment,
    });
    res.send(comment);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/:id", async (req, res) => {
  console.log(req.body, req.params.id);
  try {
    const comment = await Room.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.send(comment);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const comment = await Room.findByIdAndDelete(req.params.id);
    res.send(comment);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
