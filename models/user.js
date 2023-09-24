const mongoose = require("mongoose");
const Schema = mongoose.Schema; //載入 mongoose.Schema 功能

const userSchema = new Schema({
  //使用 new Schema() 宣告資料
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", userSchema);
