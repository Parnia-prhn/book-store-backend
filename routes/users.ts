import { FastifyInstance } from "fastify";
import {
  getUserAddedBooks,
  createUser,
  addFavoriteBooks,
} from "../controllers/userController";

async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/addedbooks/:userId", getUserAddedBooks);

  //fastify.post("/users/createUser", createUser);

  fastify.post("/users/addFavoriteBooks/:userId/:bookId", addFavoriteBooks);
}
export default userRoutes;
