const mongoose = require("mongoose"); //載入mongoose

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
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

module.exports = db;