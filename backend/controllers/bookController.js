const Book = require("../models/Book");

// In-memory storage as fallback when MongoDB isn't available
const inMemoryBooks = [
  {
    _id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Check if we have MongoDB connection
const useInMemory = () => {
  try {
    const mongoConnectionState = require("mongoose").connection.readyState;
    const mongoUriDefined =
      process.env.MONGO_URI && process.env.MONGO_URI.length > 0;

    // Return true if MongoDB is not connected or MONGO_URI is not defined
    const useInMem = !mongoUriDefined || mongoConnectionState !== 1;
    console.log(
      `Using in-memory storage: ${useInMem}, MongoDB state: ${mongoConnectionState}`
    );
    return useInMem;
  } catch (error) {
    console.error("Error checking MongoDB connection:", error.message);
    return true; // Default to in-memory if there's an error
  }
};

const getBooks = async (req, res) => {
  try {
    if (useInMemory()) {
      console.log("Using in-memory books data");
      return res.json(inMemoryBooks);
    }

    const books = await Book.find();
    console.log(`Found ${books.length} books in database`);
    res.json(books);
  } catch (error) {
    console.error("Error in getBooks:", error.message);
    // Fallback to in-memory data on error
    console.log("Falling back to in-memory books data");
    res.json(inMemoryBooks);
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Looking for book with ID: ${id}`);

    if (useInMemory()) {
      console.log("Using in-memory book data");
      const book = inMemoryBooks.find((book) => book._id === id);
      if (!book) {
        console.log(`Book with ID ${id} not found in memory`);
        return res.status(404).json({ message: "Book not found" });
      }
      return res.json(book);
    }

    const book = await Book.findById(id);

    if (!book) {
      console.log(`Book with ID ${id} not found in database`);
      return res.status(404).json({ message: "Book not found" });
    }

    console.log(`Found book: ${book.title}`);
    res.json(book);
  } catch (error) {
    console.error("Error in getBookById:", error.message);
    // Try fallback to in-memory for the requested ID
    const book = inMemoryBooks.find((book) => book._id === req.params.id);
    if (book) {
      console.log(`Found book in memory: ${book.title}`);
      return res.json(book);
    }
    res.status(500).json({ message: "Server error" });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;

    if (!title || !author || !price) {
      return res
        .status(400)
        .json({ message: "Title, author and price are required" });
    }

    console.log(`Creating new book: "${title}" by ${author}`);

    if (useInMemory()) {
      console.log("Using in-memory book storage");
      const newBookId = (inMemoryBooks.length + 1).toString();
      const newBook = {
        _id: newBookId,
        title,
        author,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryBooks.push(newBook);
      console.log(`Book created with ID: ${newBookId}`);
      return res.status(201).json(newBook);
    }

    const book = new Book({
      title,
      author,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
    });

    await book.save();
    console.log(`Book created in database with ID: ${book._id}`);
    res.status(201).json(book);
  } catch (error) {
    console.error("Error in createBook:", error.message);
    res.status(500).json({ message: "Server error - Could not create book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, stock } = req.body;

    console.log(`Updating book with ID: ${id}`);

    if (useInMemory()) {
      console.log("Using in-memory book storage");
      const bookIndex = inMemoryBooks.findIndex((book) => book._id === id);
      if (bookIndex === -1) {
        console.log(`Book with ID ${id} not found in memory`);
        return res.status(404).json({ message: "Book not found" });
      }

      inMemoryBooks[bookIndex] = {
        ...inMemoryBooks[bookIndex],
        title: title || inMemoryBooks[bookIndex].title,
        author: author || inMemoryBooks[bookIndex].author,
        price:
          price !== undefined ? Number(price) : inMemoryBooks[bookIndex].price,
        stock:
          stock !== undefined ? Number(stock) : inMemoryBooks[bookIndex].stock,
        updatedAt: new Date().toISOString(),
      };

      console.log(`Book updated in memory: ${inMemoryBooks[bookIndex].title}`);
      return res.json(inMemoryBooks[bookIndex]);
    }

    const book = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      console.log(`Book with ID ${id} not found in database`);
      return res.status(404).json({ message: "Book not found" });
    }

    console.log(`Book updated in database: ${book.title}`);
    res.json(book);
  } catch (error) {
    console.error("Error in updateBook:", error.message);
    res.status(500).json({ message: "Server error - Could not update book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting book with ID: ${id}`);

    if (useInMemory()) {
      console.log("Using in-memory book storage");
      const bookIndex = inMemoryBooks.findIndex((book) => book._id === id);
      if (bookIndex === -1) {
        console.log(`Book with ID ${id} not found in memory`);
        return res.status(404).json({ message: "Book not found" });
      }

      const deletedBook = inMemoryBooks[bookIndex];
      inMemoryBooks.splice(bookIndex, 1);
      console.log(`Book deleted from memory: ${deletedBook.title}`);
      return res.json({
        message: "Book deleted successfully",
        book: deletedBook,
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      console.log(`Book with ID ${id} not found in database`);
      return res.status(404).json({ message: "Book not found" });
    }

    console.log(`Book deleted from database: ${book.title}`);
    res.json({ message: "Book deleted successfully", book });
  } catch (error) {
    console.error("Error in deleteBook:", error.message);
    res.status(500).json({ message: "Server error - Could not delete book" });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
