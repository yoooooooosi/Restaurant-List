//此檔會匯出一個物件，而物件中有authenticator 的函式
module.exports = {
  authenticator: (req, res, next) => {
    //req.isAuthenticated()會根據 request 的登入狀態回傳 true 或 false
    if (req.isAuthenticated()) {
      return next(); //登入成功(true)進入下一個 middleware
    }
    req.flash("warning_msg", "請先登入才能使用！");
    res.redirect("/users/login"); //登入失敗(false)，強制返回 login 頁面
  },
};