import mongoose, { Document, Schema } from "mongoose";

interface IShoppingCart extends Document {
  user: string;
  books: { bookId: string; quantity: number }[];
  totalPrice: number;
}

const shoppingCartSchema = new Schema<IShoppingCart>({
  user: {
    type: String,
    required: true,
  },
  books: [
    {
      bookId: {
        type: String,
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
