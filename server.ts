import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import connectToDatabase from "./config/db";
import bookRoutes from "./routes/books";
import shoppingCartRoutes from "./routes/shoppingCart";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";

const app: FastifyInstance = fastify();

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
    app.listen(3000, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
}

startApp();
