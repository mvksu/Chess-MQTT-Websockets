const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const comments = await Message.find({});
    res.send(comments);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const messages = await Message.find({ username: req.params.username });
    res.send(messages);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const comment = await Message.create(req.body);
    res.send(comment);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/:id", async (req, res) => {
  console.log(req.body, req.params.id);
  try {
    const comment = await Message.findOneAndUpdate({ _id: req.params.id }, {text: req.body.text}, { new: true });
    res.send(comment);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const comment = await Message.findByIdAndDelete(req.params.id);
    res.send(comment);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
