const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  password: String,
});

module.exports = model("user", userSchema);
