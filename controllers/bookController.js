const Book = require("../models/Book");

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
