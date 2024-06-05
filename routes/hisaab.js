const express = require("express");
const isLoggedIn = require("../middlewares/login-middleware");
const router = express.Router();
const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/users-model");


router.get("/", (req, res) => {
  res.send("i am hisaab");
});

router.get("/all", isLoggedIn , async (req, res) => {
  let user =  await userModel.findOne({email:req.user.email}).populate("hisaab")

  res.send(user); 
})

router.post("/create",  isLoggedIn, async (req, res) => {
  let { title, description, encrypted, shareable, passcode, editpermissions } = req.body;
  let hisaab = await hisaabModel.create({
    title: title,
    description: description,
    user: req.user.id,
    encrypted: encrypted,
    shareable: shareable,
    passcode: passcode,
    editpermissions: editpermissions,
  });

  let user = await userModel.findOne({ email: req.user.email });
  user.hisaab.push(hisaab._id);

  await user.save();

  res.send(hisaab);
});

module.exports = router;
