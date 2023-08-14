//設定基本套件
const express = require('express')

const exphbs = require("express-handlebars");
const mongoose = require('mongoose') //載入mongoose
const restaurantList = require('./restaurant.json')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}

const app = express();
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
})//用來監聽是否有觸發open


//設定伺服器參數
const port = 3000

//設定樣板引擎，其中全局layoutj為main.handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine','handlebars') //

//告知express靜態檔案路徑
app.use(express.static("public")); //告知express靜態檔案放置在public資料夾中

// 設定路由
//主頁面
app.get('/',(req,res) =>{
  res.render("index", { restaurants: restaurantList.results });
})

//內部訊息(show)
app.get("/restaurants/:restaurant_id",(req,res)=>{
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id); //將restaurant.id轉為字串
  res.render("show", { restaurant: restaurant });
});

//搜尋
app.get('/search',(req,res)=>{
  const keyword = req.query.keyword.toLocaleLowerCase()
  const restaurants =  restaurantList.results.filter((restaurant) => { return (
    restaurant.name.toLocaleLowerCase().includes(keyword) ||
    restaurant.category.toLocaleLowerCase().includes(keyword) //為確保有英文，設定toLocaleLowerCase()將所有輸入轉乘小寫
  );}) //搜尋餐廳名稱或類別皆可

  res.render("index", { restaurants: restaurants , keyword: keyword });
})

// 監聽
app.listen(port,()=>{
  console.log(`Express is listening to http://localhost:${port}`);
})