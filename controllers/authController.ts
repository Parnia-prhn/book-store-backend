import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { createUser } from "./userController";

async function signUp(req: Request, reply: Reply) {
  const obj = req.body as IUser;

  const { username, password, age, gender, favoriteGenre, favoriteBooks } = obj;
  try {
    const existingUser: IUser | null = await User.findOne({ username });

    if (existingUser) {
      return reply
        .status(400)
        .send({ error: "username is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    obj.password = hashedPassword;

    const newUser: IUser = await createUser(obj);

    reply.send(newUser);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function login(req: Request, reply: Reply) {
  const { username, password } = req.body as any;

  try {
    const user: IUser | null = await User.findOne({ username });

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "my_first_project_bookStore", {
      expiresIn: "1h",
    });

    reply.send({ token, user });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export { signUp, login };
