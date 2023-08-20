
const Restaurant = require('../restaurant') //載入model
const restaurantList = require("../../restaurant.json").results; //匯入restaurant的seeder(它包在results內)
const db = require("../../config/mongoose");

//連線成功
db.once('open',()=>{
  Restaurant.create(restaurantList)
    .then(()=> {
      console.log("seeder done");
      db.close(); //將資料庫關閉，避免佔記憶體
    })
    .catch((error) => console.log(error));
})//用來監聽是否有觸發open
