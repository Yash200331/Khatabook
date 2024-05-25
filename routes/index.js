const express = require("express");
const router = express.Router();
const userModel = require("../models/users-model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
  



router.get("/", function (req, res) {
  res.render("index");
});
router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", async function (req, res) {
  let {username, name, email, password} = req.body;

  let user = await userModel.findOne({email})

  if(user) return res.send("You have already registered")

  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        name,
        email,
        password:hash,
      })
      let token = jwt.sign({email, id: createdUser._id},process.env.JWT_SECRET)
      res.cookie("token", token)
      res.send(createdUser);
    })
  })
});

module.exports = router;
