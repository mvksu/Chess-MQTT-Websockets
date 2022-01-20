const router = require("express").Router();
const User = require("../models/User");

//Users

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
      const user = await User.find({ username: id });
      res.send(user[0]);
    } catch (err) {
      console.log(err);
    }
  });

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send({ msg: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "There is a user with that username" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user[0]) {
      res.send({ token: null, msg: "Inncorrect credentials" });
    } else {
      res.send({ token: req.body.username, msg: "Login successful" });
    }
  } catch (error) {
    console.log(err);
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

router.delete("/users/:id", function async(req, res) {
  try {
    res.send(user);
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
