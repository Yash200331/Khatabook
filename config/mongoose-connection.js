const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/khaatabookn18")
  .then(function () {
    console.log("connected to Mongo");
  })
  .catch(function (err) {
    console.log(err);
  });

let db = mongoose.connection;

module.exports = db;
