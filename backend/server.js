const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Set NODE_ENV to development by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

// Load environment variables from .env file
const envPath = path.join(__dirname, ".env");
console.log(`Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

// Log environment variables (don't log secrets in production)
console.log(
  `MongoDB URI is ${process.env.MONGO_URI ? "defined" : "NOT DEFINED"}`
);
console.log(
  `JWT Secret is ${process.env.JWT_SECRET ? "defined" : "NOT DEFINED"}`
);
console.log(`PORT is set to ${process.env.PORT || "default"}`);

const app = express();

// Configure CORS to allow all origins (for deployment)
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB with fallback to in-memory storage
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore";
console.log(
  `Attempting to connect to MongoDB at: ${
    mongoUri.includes("@") ? mongoUri.split("@")[1].split("/")[0] : "localhost"
  }`
);

mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
    connectTimeoutMS: 10000, // 10 seconds for initial connection
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    console.log("Using database storage for all operations");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log(
      "Falling back to in-memory storage. All data will be lost when the server restarts."
    );
    console.log(
      "To whitelist your IP in MongoDB Atlas, visit: https://www.mongodb.com/docs/atlas/security-whitelist/"
    );
  });

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api", require("./routes/health"));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Explicitly listen on all interfaces (both IPv4 and IPv6)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Access via http://localhost:${PORT} or http://127.0.0.1:${PORT}`
  );
});
