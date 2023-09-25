const bcrypt = require("bcryptjs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const User = require("../user");
const Restaurant = require("../restaurant"); //載入model
const restaurantList = require("../../restaurant.json").results; //匯入restaurant的seeder(它包在results內)
const db = require("../../config/mongoose");

const SEED_USER01 = {
  name: "user1",
  email: "user1@example.com",
  password: "12345678",
};

const SEED_USER02 = {
  name: "user2",
  email: "user2@example.com",
  password: "12345678",
};

const createUserAndRestaurants = (user, restaurantIds) => {
  //先建立包含user和restaurantIds參數的函數

  return (
    bcrypt //開始使用雜湊函數
      .genSalt(10)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) =>
        //建立user
        User.create({
          name: user.name,
          email: user.email,
          password: hash,
        })
      )
      //餐廳部分
      .then((user) => {
        //當user建立完畢後，執行下一步
        const promises = restaurantIds.map((id) => {
          //利用map將restaurantIds中的id一一執行出來
          const restaurant = restaurantList.find((data) => data.id === id); //根據 id 找到相應的餐廳
          restaurant.userId = user._id; // 為找到的餐廳設置 userId
          return Restaurant.create(restaurant); // 創建餐廳並返回 Promise
        });
        return Promise.all(promises); //確保每個值跑完
      })
      .then(() => {
        console.log(`${user.name} and restaurants seeded successfully.`);
      })
  );
};

db.once("open", () => {
  createUserAndRestaurants(SEED_USER01, [1, 2, 3]) 
  //傳入 SEED_USER01 和 [1, 2, 3] 作為參數，並建立其user及restaurantIds
    .then(() => createUserAndRestaurants(SEED_USER02, [4, 5, 6])) //再來執行第二位user
    .then(() => {
      console.log("All seed data added successfully!");
      process.exit();
    })
    .catch((error) => console.error(error));
});
