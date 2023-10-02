//restaurant 路由模組
const express = require("express"); //導入express 套件
const router = express.Router(); //導入express路由器

const Restaurant = require("../../models/restaurant"); //載入model


// 設定路由 , 注意路由器擺放順序!!!

//新增餐廳
router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res) => {
  const userId = req.user._id;
  const data = req.body;
  return Restaurant.create({ ...data, userId })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//編輯餐廳
router.get("/:restaurant_id/edit", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});

router.put("/:restaurant_id", (req, res) => {
  //使用OObject.assign
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      Object.assign(restaurant, req.body);
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
});

//內部訊息(show)
router.get("/:restaurant_id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
  // const restaurant = restaurantList.results.find(
  //   (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  // ); //將restaurant.id轉為字串
  // res.render("show", { restaurant: restaurant });
});

//刪除餐廳
router.delete("/:restaurant_id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      restaurant.remove();
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});



module.exports = router