const express = require("express");
const router = express.Router();

//路由設定清單

//登入表單頁面 ,GET /users/login
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router; //匯出路由模組
