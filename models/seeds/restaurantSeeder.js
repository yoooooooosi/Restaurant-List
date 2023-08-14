const mongoose = require("mongoose"); //載入mongoose
const Restaurant = require('../restaurant') //載入model
const restaurantList = require("../../restaurant.json").results; //匯入restaurant的seeder(它包在results內)

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //設定連線至資料庫

const db = mongoose.connection //將連線狀態存取至物件db

//連線異常
db.on('error',()=>{
  console.log('mongodb error !')
}) //用來監聽是否有觸發error

//連線成功
db.once('open',()=>{
  console.log('mongodb connected !')
  Restaurant.create(restaurantList)
    .then(()=> {
      console.log("seeder done");
      db.close(); //將資料庫關閉，避免佔記憶體
    })
    .catch((error) => console.log(error));
})//用來監聽是否有觸發open
