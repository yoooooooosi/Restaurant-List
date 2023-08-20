//home路由模組
const express = require("express"); //導入express 套件
const router = express.Router(); //導入express路由器

const Restaurant = require("../../models/restaurant"); //載入model

//主頁面(瀏覽根頁面)
router.get("/", (req, res) => {
  Restaurant.find() // 取出 Todo model 裡的所有資料
    //撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then((restaurants) => res.render("index", { restaurants })) // 將資料傳給 index 樣板
    .catch((error) => console.log(error)); // 錯誤處理
});

// 匯出路由模組
module.exports = router;
