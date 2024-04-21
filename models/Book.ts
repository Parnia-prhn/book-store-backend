import mongoose, { Document, Schema } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  price: number;
  userIdCreator: mongoose.Types.ObjectId;
}

const bookSchema = new Schema<IBook>({
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
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userIdCreator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Book = mongoose.model<IBook>("Book", bookSchema);

export { Book, IBook };
