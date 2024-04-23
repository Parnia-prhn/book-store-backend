import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  age: number;
  gender: string;
  favoriteGenre: string;
  favoriteBooks: { bookId: string }[];
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
    default: 1,
  },
  gender: {
    type: String,
    required: false,
    default: "male",
  },
  favoriteGenre: {
    type: String,
    required: false,
    default: " ",
  },
  favoriteBooks: [
    {
      bookId: {
        type: String,
        required: false,
        default: " ",
      },
    },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser };
