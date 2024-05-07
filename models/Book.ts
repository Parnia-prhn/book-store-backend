import mongoose, { Document, Schema } from "mongoose";

interface IBook extends Document {
  image: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  price: number;
  userIdCreator: string;
  isDeleted: boolean;
}

const bookSchema = new Schema<IBook>({
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: false,
    default: " ",
  },
  publisher: {
    type: String,
    required: false,
    default: " ",
  },
  price: {
    type: Number,
    required: true,
  },
  userIdCreator: {
    type: String,
    required: false,
    default: " ",
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const Book = mongoose.model<IBook>("Book", bookSchema);

export { Book, IBook };
