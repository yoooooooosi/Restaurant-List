//home路由模組
const express = require("express"); //導入express 套件
const router = express.Router(); //導入express路由器

const Restaurant = require("../../models/restaurant"); //載入model
const { connections } = require("mongoose");

//主頁面(瀏覽根頁面)
router.get("/", (req, res) => {
  const userId = req.user._id 
  Restaurant.find({ userId }) // 取出 Todo model 裡屬於該userId的所有資料
    //撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then((restaurants) => res.render("index", { restaurants })) // 將資料傳給 index 樣板
    .catch((error) => console.log(error)); // 錯誤處理
});

//排序

router.get("/sort", (req, res) => {
  const sortBy = req.query.sort; //找到使用者選擇的排序方式

  function getSortKey() {
    if (sortBy === "A - Z" || sortBy === "Z - A") {
      return "name";
    } else if (sortBy === "類別") {
      return "category";
    } else if (sortBy === "地區") {
      return "location";
    }
  }

  function getSortMethod() {
    if (sortBy === "A - Z" || sortBy === "類別" || sortBy === "地區") {
      return "asc";
    } else if (sortBy === "Z - A") {
      return "desc";
    }
  }

  const sortKey = getSortKey();
  const sortDirection = getSortMethod();

  Restaurant.find({ userId })
    .lean()
    .sort({ [sortKey]: sortDirection })
    .then((restaurants) => {
      res.render("index", { restaurants });
      console.log("done");
    })
    .catch((error) => console.log(error));
});




//搜尋
router.get("/search", (req, res) => {
  //當輸入框為空值時，重新導入首頁
  if (!req.query.keywords) {
    res.redirect("/");
  }

  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase();

  Restaurant.find({ userId })
    .lean()
    .then((restaurants) => {
      const fliterrestaurants = restaurants.filter(
        (data) =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      );
      res.render("index", {
        restaurants: fliterrestaurants,
        keywords,
      });
    })
    .catch((err) => console.log(err));
});

// 匯出路由模組
module.exports = router;
