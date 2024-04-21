import mongoose, { Document, Schema } from "mongoose";

interface IShoppingCart extends Document {
  user: mongoose.Types.ObjectId;
  books: { bookId: mongoose.Types.ObjectId; quantity: number }[];
  totalPrice: number;
}

const shoppingCartSchema = new Schema<IShoppingCart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  books: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

const ShoppingCart = mongoose.model<IShoppingCart>(
  "ShoppingCart",
  shoppingCartSchema
);

export { ShoppingCart, IShoppingCart };
