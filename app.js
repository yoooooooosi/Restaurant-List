//設定基本套件
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose"); //載入mongoose
const bodyParser = require('body-parser')// 引用 body-parser
const methodOverride = require('method-override')
const routes = require("./routes") // 引用路由器


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //設定連線至資料庫

const db = mongoose.connection; //將連線狀態存取至物件db

//連線異常
db.on("error", () => {
  console.log("mongodb error !");
}); //用來監聽是否有觸發error

//連線成功
db.once("open", () => {
  console.log("mongodb connected !");
}); //用來監聽是否有觸發open

//設定伺服器參數
const port = 3000;

//設定樣板引擎，其中全局layoutj為main.handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars"); //

//告知express靜態檔案路徑
app.use(express.static("public")); //告知express靜態檔案放置在public資料夾中
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(routes) // 將 request 導入路由器



// 監聽
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`);
});
