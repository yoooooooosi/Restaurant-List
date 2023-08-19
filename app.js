//設定基本套件
const express = require("express");
const Restaurant = require("./models/restaurant"); //載入model
const exphbs = require("express-handlebars");
const mongoose = require("mongoose"); //載入mongoose
const restaurantList = require("./restaurant.json");
// 引用 body-parser
const bodyParser = require('body-parser')


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

// 設定路由
//主頁面(瀏覽根頁面)
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.log(error));
});

//注意路由器擺放順序!!!

//新增餐廳
app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});

app.post("/restaurants",(req,res) =>{
  const name = req.body.name; 
  const name_en = req.body.name_en; 
  const category = req.body.category; 
  const image = req.body.image; 
  const location = req.body.location; 
  const phone = req.body.phone;   
  const google_map = req.body.google_map; 
  const rating = req.body.rating; 
  const description = req.body.description; 

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));

});

//編輯餐廳
app.get("/restaurants/:restaurant_id/edit", (req, res) => {
  const id = req.params.restaurant_id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});

app.post("/restaurants/:restaurant_id/edit", (req,res)=>{
  const id = req.params.restaurant_id
  const name = req.body.name; 
  const name_en = req.body.name_en; 
  const category = req.body.category; 
  const image = req.body.image; 
  const location = req.body.location; 
  const phone = req.body.phone;   
  const google_map = req.body.google_map; 
  const rating = req.body.rating; 
  const description = req.body.description; 

  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.name = name;
      restaurant.name_en = name_en;
      restaurant.category = category;
      restaurant.image = image;
      restaurant.location = location;
      restaurant.phone = phone;
      restaurant.google_map = google_map;
      restaurant.rating = rating;
      restaurant.description = description;

      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error));
});

//內部訊息(show)
app.get("/restaurants/:restaurant_id", (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
  // const restaurant = restaurantList.results.find(
  //   (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  // ); //將restaurant.id轉為字串
  // res.render("show", { restaurant: restaurant });
});




//搜尋
app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLocaleLowerCase();
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLocaleLowerCase().includes(keyword) ||
      restaurant.category.toLocaleLowerCase().includes(keyword) //為確保有英文，設定toLocaleLowerCase()將所有輸入轉乘小寫
    );
  }); //搜尋餐廳名稱或類別皆可

  res.render("index", { restaurants: restaurants, keyword: keyword });
});

// 監聽
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`);
});
