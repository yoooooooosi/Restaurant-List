//設定基本套件
const express = require('express')
const app = express()
const exphbs = require("express-handlebars");
const restaurantList = require('./restaurant.json')

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