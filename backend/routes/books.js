const express = require("express");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getBooks);
router.get("/:id", auth, getBookById);
router.post("/", auth, adminAuth, createBook);
router.put("/:id", auth, adminAuth, updateBook);
router.delete("/:id", auth, adminAuth, deleteBook);

module.exports = router;
