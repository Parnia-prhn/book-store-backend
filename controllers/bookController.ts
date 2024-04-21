import { Request, Reply } from "fastify";
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
  const { genre } = req.params as { genre: string };
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
  const { userId } = req.params as { userId: string };

  try {
    const user = await User.findById(userId);

    if (!user) {
      reply.status(404).send({ error: "User not found" });
      return;
    }

    const favoriteGenre = user.favoriteGenre;

    if (!favoriteGenre) {
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

async function searchBooksByTitle(req: Request, reply: Reply): Promise<void> {
  const { title } = req.query;

  try {
    const books: IBook[] = await Book.find({
      title: { $regex: new RegExp(title, "i") },
    });

    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function createBook(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };
  const { title, author, genre, publisher, price } = req.body;

  try {
    const newBook: IBook = new Book({
      title,
      author,
      genre,
      publisher,
      price,
      userId,
    });

    const savedBook: IBook = await newBook.save();

    reply.send(savedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function updateBook(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };
  const { bookId } = req.params as { bookId: string };
  const { title, author, genre, publisher, price } = req.body;

  try {
    const book: IBook | null = await Book.findById(bookId);
    if (!book) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }
    if (book.userIdCreator.toString() !== userId) {
      reply.status(405).send({ error: "your not alowed to edit this book" });
      return;
    }
    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      bookId,
      { title, author, genre, publisher, price, userId },
      { new: true }
    );
    // if (!updatedBook) {
    //   reply.status(404).send({ error: "Book not found" });
    //   return;
    // }

    reply.send(updatedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function deleteBook(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };
  const { bookId } = req.params as { bookId: string };

  try {
    const book: IBook | null = await Book.findById(bookId);
    if (!book) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }
    if (book.userIdCreator.toString() !== userId) {
      reply.status(405).send({ error: "your not alowed to delete this book" });
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
  searchBooksByTitle,
  createBook,
  updateBook,
  deleteBook,
};
