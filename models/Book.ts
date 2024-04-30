import mongoose, { Document, Schema } from "mongoose";

interface IBook extends Document {
  image: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  price: number;
  userIdCreator: string;
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
});
const Book = mongoose.model<IBook>("Book", bookSchema);

export { Book, IBook };
