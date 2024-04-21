import { FastifyInstance } from "fastify";
import { getUserAddedBooks, createUser } from "../controllers/userController";

async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/addedbooks/:userId", getUserAddedBooks);

  fastify.post("/users/createUser", createUser);
}
export default userRoutes;
