import {
  fastify,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import connectToDatabase from "./config/db";
import bookRoutes from "./routes/books";
import shoppingCartRoutes from "./routes/shoppingCart";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
// var cors = require("cors");

import cors from "@fastify/cors";
// const cors = require("fastify-cors");
// import cors from "fastify-cors";

const app: FastifyInstance = fastify();
// app.use(cors());
app.register(cors);
function requestLogger(
  req: FastifyRequest,
  reply: FastifyReply,
  next: () => void
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

async function startApp() {
  try {
    const dbConnection = await connectToDatabase();
    app.register(authRoutes);
    app.register(bookRoutes);
    app.register(shoppingCartRoutes);
    app.register(userRoutes);

    app.addHook("preHandler", requestLogger);
    app.listen({ port: 3001 }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("Server is running on port 3001");
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
}

startApp();
