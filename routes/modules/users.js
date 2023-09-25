const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport"); //載入 passport

//路由設定清單

//登入表單頁面 ,GET /users/login
router.get("/login", (req, res) => {
  res.render("login");
});

//主要為驗證登入狀態，當使用者在頁面點入login的按鈕時，需要利用passport所提供的authenticate來驗證可否登入
//而passport.authenticate屬於中間層
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);


//註冊表單頁面 ,GET /users/register
router.get("/register", (req, res) => {
  res.render("register");
});

router.post('/register',(req,res)=>{
  //取得表單的參數，從register表單那獲得
  const { name, email, password, confirmPassword } = req.body; //解構賦值

  //利用email來查看是否有被註冊
  User.findOne({ email })
    .then((user) => {
      //當帳號存在，則倒回原本畫面
      if (user) {
        console.log("此帳號已存在!");
        res.render("register", {
          name,
          email,
          password,
          confirmPassword,
        });
      } else {
        //當帳號不存在，則建立資料，並寫入資料庫
        //要記得加return
        return (
          User.create({
            name,
            email,
            password,
          })
            //建立完畢後，將頁面導向首頁
            .then(() => res.redirect("/"))
            .catch((err) => console.log(err))
        );
      }
    })
    .catch((err) => console.log(err));
})

//登出表單頁面，
router.get('/logout',(req,res)=>{
  req.logout(); //passport.js所提供的函式，會清除 session
  res.redirect("/users/login"); //倒回登入頁面
})

module.exports = router; //匯出路由模組
