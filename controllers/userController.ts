import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Book, IBook } from "../models/Book";
import { User, IUser } from "../models/User";

async function getUserAddedBooks(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  // const { userId } = req.params as { userId: string };

  try {
    const addedBooks: IBook[] = await Book.find({ userIdCreator: userId });

    if (addedBooks.length === 0) {
      reply.status(404).send({ error: "No books added by the user found" });
      return;
    }

    reply.send(addedBooks);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function createUser(obj: IUser): Promise<IUser> {
  // const { username, password, age, gender, favoriteGenre, favoriteBooks } = obj;
  const username = obj.username;
  const password = obj.password;
  const age = obj.age;
  const gender = obj.gender;
  const favoriteGenre = obj.favoriteGenre;
  const favoriteBooks = obj.favoriteBooks;
  try {
    const existingUser: IUser | null = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser: IUser = new User({
      username,
      password,
      age,
      gender,
      favoriteGenre,
      favoriteBooks,
    });

    const savedUser: IUser = await newUser.save();

    return savedUser;
  } catch (err) {
    throw new Error("Internal server error");
  }
}

async function addFavoriteBooks(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
    bookId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const bookIdToAdd = params.bookId;
  if (!bookIdToAdd) {
    reply.status(400).send({ error: "Book ID is missing from the request" });
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      reply.status(404).send({ error: " User not found " });
      return;
    }
    const bookObject = { bookId: bookIdToAdd };

    if (user.favoriteBooks.includes(bookObject)) {
      reply.send({ message: "Book already exists in user's favorite list" });
      return;
    }
    user.favoriteBooks.push(bookObject);

    const updatedUser = await user.save();
    reply.send(updatedUser);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export { getUserAddedBooks, createUser, addFavoriteBooks };
