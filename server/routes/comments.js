const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send(comments);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:username", async (req, res) => {
  try {
    const receiver = await User.find({ username: req.params.username})
    const comments = await Comment.find({ receiver: receiver }).populate('author').populate('receiver')
    res.send(comments);
  } catch (err) {
    console.log(err);
  }
});

router.post("/author/:author/receiver/:receiver", async (req, res) => {
  const { text } = req.body;
  try {
    const author = await User.find({ username: req.params.author})
    const receiver = await User.find({ username: req.params.receiver})
    const comment = await Comment.create({ text: text, author: author[0], receiver: receiver[0]});
    res.send(comment);
  } catch (error) {
    console.log(error.message);
  }
});


router.put("/users/", async (req, res) => {
  const user = userEdit(req.body);
  try {
    res.send(user);
  } catch (error) {
    console.log(err);
  }
});

router.delete("/:id", async(req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    res.send(comment);
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
