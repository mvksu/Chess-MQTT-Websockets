const router = require("express").Router();

//Messages

router.get("/users", function async (req, res) {
  const users = getAllUsers();
  try {
    res.send(users);
  } catch (error) {
    console.log(err);
  }
});

router.post("/users", function async (req, res) {
  const user = userJoin(req.body);
  try {
    res.send(user);
  } catch (error) {
    console.log(err);
  }
});

router.put("/users/:id", function async (req, res) {
  const user = userEdit(req.body);
  try {
    res.send(user);
  } catch (error) {
    console.log(err);
  }
});

router.delete("/users/:id", function async (req, res) {
  const user = userJoin(req.body);
  try {
    res.send(user);
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
