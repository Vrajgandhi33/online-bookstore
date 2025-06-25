const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Book = require("./models/Book");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = new User({
      email: "admin@test.com",
      password: adminPassword,
      role: "admin",
    });
    await admin.save();

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 12);
    const user = new User({
      email: "user@test.com",
      password: userPassword,
      role: "user",
    });
    await user.save();

    // Create some books
    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        stock: 25,
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        stock: 30,
      },
      {
        title: "1984",
        author: "George Orwell",
        price: 13.99,
        stock: 20,
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 11.99,
        stock: 15,
      },
    ];

    await Book.insertMany(books);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
