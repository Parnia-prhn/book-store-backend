import { FastifyInstance } from "fastify";
import {
  getMostSoldBooks,
  getBoughtBooks,
  getBooksForCart,
  addBookToCart,
} from "../controllers/cartController";

async function shoppingCartRoutes(fastify: FastifyInstance) {
  fastify.get("/shoppingCart/mostSold", getMostSoldBooks);

  fastify.get("/shoppingCart/allBought/:userId", getBoughtBooks);

  fastify.get("/shoppingCart/cart/:userId", getBooksForCart);

  fastify.post("/shoppingCart/addToCart/:userId/:bookId", addBookToCart);
}

export default shoppingCartRoutes;
