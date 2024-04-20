const Book = require("../models/Book");
const User = require("../models/User");

async function getAllBooks(req, reply) {
  try {
    const books = await Book.find();
    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getBookByGenre(req, reply) {
  const { genre } = rq.params;
  try {
    const books = await Book.find({ genre: genre });

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

async function getBooksByFavoriteGenre(req, reply) {
  const { userId } = req.params;

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

    const books = await Book.find({ genre: favoriteGenre });

    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function searchBooksByTitle(req, reply) {
  const { query } = req.query;

  try {
    const books = await Book.find({
      title: { $regex: new RegExp(query, "i") },
    });

    reply.send(books);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function createBook(req, reply) {
  const { title, author, genre, description } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      genre,
      description,
    });

    const savedBook = await newBook.save();

    reply.send(savedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function updateBook(req, reply) {
  const { bookId } = req.params;
  const { title, author, genre, description } = req.body;

  try {
    let book = await Book.findById(bookId);

    if (!book) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }

    book.title = title;
    book.author = author;
    book.genre = genre;
    book.description = description;

    const updatedBook = await book.save();

    reply.send(updatedBook);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function deleteBook(req, reply) {
  const { bookId } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      reply.status(404).send({ error: "Book not found" });
      return;
    }

    reply.send({ message: "Book deleted successfully" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

module.exports = {
  getAllBooks,
  getBookByGenre,
  getBooksByFavoriteGenre,
  searchBooksByTitle,
  createBook,
  updateBook,
  deleteBook,
  // Other exported controller functions
};
