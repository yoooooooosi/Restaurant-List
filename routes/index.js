//總路由器
const express = require('express')//引入express
const router = express.Router();//引入express路由器

const home = require('./modules/home') // 引入 home 模組程式碼
const restaurant = require('./modules/restaurant') // 引入 restaurant 模組程式碼
const users = require("./modules/users"); 

const { authenticator } = require("../middleware/auth");  // 掛載 middleware
//從middleware/auth中拿取名為authenticator的函數

//如果符合路徑，便將request導向各自模組
router.use("/restaurants", authenticator, restaurant);
router.use("/users", users);
router.use("/", authenticator, home); 

//匯出路由器
module.exports = router;