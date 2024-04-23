import { FastifyInstance } from "fastify";
import {
  getAllBooks,
  getBookByGenre,
  getBooksByFavoriteGenre,
  getFavoriteBooks,
  searchBooksByTitle,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";

async function bookRoutes(fastify: FastifyInstance) {
  fastify.get("/books", getAllBooks);

  fastify.get("/books/genre/:genre", getBookByGenre);

  fastify.get("/books/favoriteGenre/:userId", getBooksByFavoriteGenre);

  fastify.get("/books/favoriteBooks/:userId", getFavoriteBooks);

  fastify.get("/books/search", searchBooksByTitle);

  fastify.post("/books/create/:userId", createBook);

  fastify.put("/books/update/:userId/:bookId", updateBook);

  fastify.delete("books/delete/:userId/:bookId", deleteBook);
}

export default bookRoutes;
