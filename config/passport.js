//passport主要用來驗證請求（request），並在成功驗證後，將用戶資訊附加到 req.user
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user')
const bcrypt = require("bcryptjs");

//匯出一個 function
//app 把 passport 套件傳進來
module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize());
  app.use(passport.session());

  // 設定本地登入策略
  passport.use(
    //有兩種情況在登入時是會造成錯誤
    //驗證項目=>usernameFiel為email
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          //第一種情況，user的email還未被註冊過
          if (!user) {
            return done(null, false, {
              message: "That email is not registered!",
            });
          }
          //第二種情況，user的密碼或信箱錯誤
          return bcrypt.compare(password, user.password).then((ismath) => {
            if (!ismath) {
              return done(null, false, {
                message: "Email or Password incorrect.",
              });
            }
            //如果正確則回傳user資料
            return done(null, user);
          });
        })
        .catch((err) => done(err, false));
    })
  );

  // 設定序列化與反序列化

  //序列化 : 為保持session的輕巧，因此在此過程中只保留了id
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //反序列化: 利用session已知的userid，反向查詢該id的所有資訊，並將資料儲存在req.user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};

