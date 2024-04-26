import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Book, IBook } from "../models/Book";
import { User } from "../models/User";

async function getAllBooks(req: Request, reply: Reply): Promise<void> {
  try {
    const books: IBook[] = await Book.find();
    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getBookByGenre(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    genre?: string;
  }
  const params = req.params as ParamsType;
  const genre = params.genre;
  try {
    const books: IBook[] = await Book.find({ genre: genre });

    if (!books || books.length === 0) {
      reply
        .status(404)
        .send({ error: "No books found with the specified genre" });
      return;
    }
    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getBooksByFavoriteGenre(
  req: Request,
  reply: Reply
): Promise<void> {
  interface ParamsType {
    userId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      reply.status(404).send({ error: "User not found" });
      return;
    }

    const favoriteGenre = user.favoriteGenre;

    if (!favoriteGenre || favoriteGenre == " ") {
      reply
        .status(400)
        .send({ error: "Favorite genre not specified for the user" });
      return;
    }

    const books: IBook[] = await Book.find({ genre: favoriteGenre });

    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getFavoriteBooks(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      reply.status(404).send({ error: " User not found " });
      return;
    }
    const bookIds: string[] = [];
    user.favoriteBooks.forEach((item) => {
      bookIds.push(item.bookId.toString());
    });

    if (bookIds.length === 0) {
      reply
        .status(400)
        .send({ error: " Favorite books not specified for the user " });
    }

    const books: IBook[] = await Book.find({ _id: { $in: bookIds } });
    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function searchBooksByTitle(req: Request, reply: Reply): Promise<void> {
  interface QueryType {
    title?: string;
  }
  const query = req.query as QueryType;
  const title = query.title ?? "";
  console.log("Received title:", title);
  try {
    const regex = new RegExp(title, "i");
    console.log("Constructed regular expression:", regex);
    const books: IBook[] = await Book.find({
      title: { $regex: regex },
    });
    console.log("Books found:", books);
   

    reply.send(books);
  } catch (err) {
    console.error("Error searching books by title:", err);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function createBook(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
  }
  const params = req.params as ParamsType;
  const userIdCreator = params.userId;
  const { title, author, genre, publisher, price } = req.body as IBook;

  try {
    const newBook: IBook = new Book({
      title,
      author,
      genre,
      publisher,
      price,
      userIdCreator,
    });
    const savedBook: IBook = await newBook.save();
    reply.send(savedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function updateBook(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
    bookId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const bookId = params.bookId;

  const { title, author, genre, publisher, price } = req.body as any;

  try {
    const book: IBook | null = await Book.findById(bookId);
    if (!book) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }
    if (book.userIdCreator.toString() !== userId) {
      reply.status(405).send({ error: "your not allowed to edit this book" });
      return;
    }
    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      bookId,
      { title, author, genre, publisher, price, userId },
      { new: true }
    );


    reply.send(updatedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function deleteBook(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
    bookId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const bookId = params.bookId;


  try {
    const book: IBook | null = await Book.findById(bookId);
    if (!book) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }
    if (book.userIdCreator.toString() !== userId) {
      reply.status(405).send({ error: "your not allowed to delete this book" });
      return;
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    reply.send({ message: "Book deleted successfully" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

export {
  getAllBooks,
  getBookByGenre,
  getBooksByFavoriteGenre,
  getFavoriteBooks,
  searchBooksByTitle,
  createBook,
  updateBook,
  deleteBook,
};
