//此路由為設定Facebook登入策略
const express = require("express");
const router = express.Router();

const passport = require("passport");


//先去向 Facebook 發出請求(重新定向Facebook登入頁面)，並要求email和public_profile兩樣資料
router.get("/facebook",passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

//接收資料，假設資料可用，則登入並進入首頁，失敗則回登入頁面
//主要為驗證登入狀態，利用passport所提供的authenticate來驗證可否登入
router.get("/facebook/callback",passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;