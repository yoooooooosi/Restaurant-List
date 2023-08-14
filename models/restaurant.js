const mongoose = require('mongoose') //載入mongoose套件
const Schema = mongoose.Schema //載入 mongoose.Schema 模組

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: number,
    required: true,
  },
  google_map: {
    type: String,
    required: true,
  },
  rating: {
    type: number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);


