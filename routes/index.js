const express = require("express");
const router = express.Router();
const userModel = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log(process.env.JWT_SECRET);
const isLoggedIn = require("../middlewares/login-middleware")

router.get("/", function (req, res) {
  res.render("index");
});
router.get("/register",  function (req, res) {
  res.render("register");
});

router.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.send("logged out");
});



router.post("/register", async function (req, res) {
  try {
    let { username, name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.send("You have already registered");

    if (process.env.JWT_SECRET) {
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          let createdUser = await userModel.create({
            username,
            name,
            email,
            password: hash,
          });
          let token = jwt.sign(
            { email, id: createdUser._id },
            process.env.JWT_SECRET
          );
          res.cookie("token", token);
          res.send("User Created Successfully");
        });
      });
    } else {
      res.send("you forgot the env variables");
    }
  } catch (err) {
    res.send(err.message);
  }
});

router.post('/login',  async (req, res) => {
    try{
      let {email, password} = req.body;
      let user = await userModel.findOne({email}).select("+password")

      if(!user) return res.send("You Have need to register first");

      if(process.env.JWT_SECRET){
        bcrypt.compare(password, user.password, (err, result) =>{
          if(result){
            let token = jwt.sign({email,id:user._id},process.env.JWT_SECRET);
            res.cookie("token", token);
            res.send("login successfully");
          }else{
            res.send("kuch glt h bhai")
          }
        })
      }else{
        res.send("you need to setup env variables first");
      }
    }
    catch(err){
      res.send(err.message);
    }
})



module.exports = router;
