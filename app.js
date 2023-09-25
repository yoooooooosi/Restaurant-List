//設定基本套件
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser')// 引用 body-parser
const methodOverride = require('method-override')
const flash = require("connect-flash") //引用Flash message

const routes = require("./routes") // 引用路由器
require("./config/mongoose");

const usePassport = require("./config/passport"); //載入config/passport.js

const app = express();

//設定伺服器參數
const port = 3000;

//設定樣板引擎，其中全局layoutj為main.handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); //

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);


//告知express靜態檔案路徑
app.use(express.static("public")); //告知express靜態檔案放置在public資料夾中
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
usePassport(app) //呼叫passport中所export的function，其參數為app
app.use(flash())  // 掛載套件
//為了使view 元件可以使用Passport.js所提供套件(通常都帶在請求req裡的)，這裡使用了本地變數 res.locals，並以middleware方式
app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated(); //將登入狀態給res.locals的儲存空間，其中資料名稱為isAuthenticated
  res.locals.user = req.user; //將使用者資料給res.locals的儲存空間
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
})

app.use(routes) // 將 request 導入路由器

// 監聽
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`);
});
