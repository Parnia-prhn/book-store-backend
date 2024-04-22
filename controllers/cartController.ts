import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Book, IBook } from "../models/Book";
import { User, IUser } from "../models/User";
import { ShoppingCart, IShoppingCart } from "../models/ShoppingCart";

async function getMostSoldBooks(req: Request, reply: Reply): Promise<void> {
  try {
    const mostSoldBooks = await ShoppingCart.aggregate([
      { $unwind: "$books" },
      {
        $group: {
          _id: "$books.bookId",
          totalQuantity: { $sum: "$books.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    const mostSoldBooksDetails = await Promise.all(
      mostSoldBooks.map(async (item: any) => {
        const book = await Book.findById(item._id);
        return { book, totalQuantity: item.totalQuantity };
      })
    );

    reply.send(mostSoldBooksDetails);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getBooksForCart(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };

  try {
    const cart = await ShoppingCart.findOne({ user: userId });

    if (!cart) {
      reply.status(404).send({ error: "Cart not found" });
      return;
    }

    const bookIds = cart.books.map((item) => item.bookId);

    const books: IBook[] = await Book.find({ _id: { $in: bookIds } });

    reply.send(books);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function addBookToCart(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };
  const { bookId, quantity } = req.body as any;

  try {
    let cart = await ShoppingCart.findOne({ user: userId });

    if (!cart) {
      cart = new ShoppingCart({ user: userId, books: [] });
    }

    const existingBook = cart.books.find((item) => item.bookId === bookId);

    if (existingBook) {
      existingBook.quantity += quantity;
    } else {
      cart.books.push({ bookId, quantity });
    }

    cart.totalPrice = cart.books.reduce((total, item) => {
      const bookPrice = 10;
      return total + bookPrice * item.quantity;
    }, 0);

    await cart.save();

    reply.send({ message: "Book added to cart successfully", cart });
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getBoughtBooks(req: Request, reply: Reply): Promise<void> {
  const { userId } = req.params as { userId: string };

  try {
    const carts: IShoppingCart[] = await ShoppingCart.find({ user: userId });

    const bookIds: string[] = [];
    carts.forEach((cart) => {
      cart.books.forEach((item) => {
        bookIds.push(item.bookId.toString());
      });
    });

    const books: IBook[] = await Book.find({ _id: { $in: bookIds } });

    reply.send(books);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

export { getMostSoldBooks, getBoughtBooks, getBooksForCart, addBookToCart };
