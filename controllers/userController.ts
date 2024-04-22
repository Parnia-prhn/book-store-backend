import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Book, IBook } from "../models/Book";
import { User, IUser } from "../models/User";

async function getUserAddedBooks(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };

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

async function createUser(req: Request): Promise<IUser> {
  const { username, password, age, gender, favoriteGenre } = req.body as any;

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
    });

    const savedUser: IUser = await newUser.save();

    return savedUser;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
export { getUserAddedBooks, createUser };
