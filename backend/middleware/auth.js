const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("Authentication failed: No token provided");
      return res.status(401).json({ message: "Authentication required" });
    }

    // Handle mock tokens in development mode
    if (
      process.env.NODE_ENV === "development" &&
      token.startsWith("mock-jwt-token-")
    ) {
      console.log("Using mock token in development mode");
      const userId = token.replace("mock-jwt-token-", "");
      req.user = { _id: userId, role: userId === "1" ? "admin" : "user" };
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Token verified for user ID: ${decoded.userId}`);

      // Check if we have MongoDB connection, if not, create a mock user
      if (require("mongoose").connection.readyState !== 1) {
        console.log("MongoDB not connected, using mock user");
        req.user = { _id: decoded.userId, role: "admin" };
        return next();
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log(`User not found for ID: ${decoded.userId}`);
        return res.status(401).json({ message: "Invalid authentication" });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.log(`JWT verification failed: ${jwtError.message}`);
      return res.status(401).json({ message: "Invalid authentication" });
    }
  } catch (error) {
    console.log(`Authentication error: ${error.message}`);
    return res.status(401).json({ message: "Invalid authentication" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // If we're in development mode with a mock admin token, allow access
    if (
      process.env.NODE_ENV === "development" &&
      req.user &&
      req.user.role === "admin"
    ) {
      console.log(`Admin access granted for mock user: ${req.user._id}`);
      return next();
    }

    if (!req.user || req.user.role !== "admin") {
      console.log(
        `Admin access denied for user: ${req.user ? req.user._id : "unknown"}`
      );
      return res.status(403).json({ message: "Admin privileges required" });
    }

    console.log(`Admin access granted for user: ${req.user._id}`);
    next();
  } catch (error) {
    console.log(`Admin authorization error: ${error.message}`);
    return res.status(403).json({ message: "Admin privileges required" });
  }
};

module.exports = { auth, adminAuth };
