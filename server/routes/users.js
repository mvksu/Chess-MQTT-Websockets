const router = require("express").Router();
const User = require("../models/User");


//Users get all
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});
//User get by username
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.find({ username: username });
    res.send(user[0]);
  } catch (err) {
    console.log(err);
  }
});
//User register
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send({ msg: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "There is a user with that username" });
  }
});
//User login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user[0]) {
      res.send({ token: null, msg: "Incorrect credentials" });
    } else {
      res.send({ token: req.body.username, msg: "Login successful" });
    }
  } catch (error) {
    console.log(err);
  }
});
//User edit
router.put("/:username/:newPassword", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    user.password = req.params.newPassword;
    await user.save()
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
//User delete
router.delete("/:username", async (req, res) => {
  try {
   const user = await User.deleteOne({ username: req.params.username });
   res.send(user[0]);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
