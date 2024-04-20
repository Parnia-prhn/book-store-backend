const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requierd: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      requierd: true,
    },
  ],
  quantity: {
    type: Number,
    requierd: true,
  },
  totalPrice: {
    type: Number,
    requierd: true,
  },
});

const ShoppingCart = mongoose.model("ShoopingCart", shoppingCartSchema);

module.exports = ShoppingCart;
