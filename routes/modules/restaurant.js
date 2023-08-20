//restaurant 路由模組
const express = require("express"); //導入express 套件
const router = express.Router(); //導入express路由器

const Restaurant = require("../../models/restaurant"); //載入model
const restaurantList = require("../../restaurant.json");

// 設定路由 , 注意路由器擺放順序!!!

//新增餐廳
router.get("/restaurants/new", (req, res) => {
  return res.render("new");
});

router.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//編輯餐廳
router.get("/restaurants/:restaurant_id/edit", (req, res) => {
  const id = req.params.restaurant_id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});

router.put("/restaurants/:restaurant_id", (req, res) => {
  //使用OObject.assign
  const id = req.params.restaurant_id;

  return Restaurant.findById(id)
    .then((restaurant) => {
      Object.assign(restaurant, req.body);
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error));
});

//內部訊息(show)
router.get("/restaurants/:restaurant_id", (req, res) => {
  const id = req.params.restaurant_id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
  // const restaurant = restaurantList.results.find(
  //   (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  // ); //將restaurant.id轉為字串
  // res.render("show", { restaurant: restaurant });
});

//刪除餐廳
router.delete("/restaurants/:restaurant_id", (req, res) => {
  const id = req.params.restaurant_id;
  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.remove();
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//搜尋
router.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLocaleLowerCase();
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLocaleLowerCase().includes(keyword) ||
      restaurant.category.toLocaleLowerCase().includes(keyword) //為確保有英文，設定toLocaleLowerCase()將所有輸入轉乘小寫
    );
  }); //搜尋餐廳名稱或類別皆可

  res.render("index", { restaurants: restaurants, keyword: keyword });
});

module.exports = router