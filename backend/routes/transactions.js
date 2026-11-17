const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const [transactions] = await db.query(
      "SELECT * FROM transactions ORDER BY transaction_date DESC"
    );

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions"
    });
  }
});


// POST a new transaction
router.post("/", async (req, res) => {
  const { book_id, user_id, transaction_type, quantity } = req.body;

  // Validate input
  if (
    !book_id ||
    !user_id ||
    !transaction_type ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid book_id, user_id, transaction_type and quantity"
    });
  }

  if (!["STOCK_IN", "BORROW"].includes(transaction_type)) {
    return res.status(400).json({
      success: false,
      message: "Transaction type must be STOCK_IN or BORROW"
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Find the selected book
    const [books] = await connection.query(
      "SELECT * FROM books WHERE id = ? FOR UPDATE",
      [book_id]
    );

    if (books.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Find the selected user
    const [users] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [user_id]
    );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const book = books[0];
    const user = users[0];

    let newQuantity = book.quantity;

    // Calculate book quantity
    if (transaction_type === "STOCK_IN") {
      newQuantity += quantity;
    } else {
      if (book.quantity < quantity) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "Not enough books available"
        });
      }

      newQuantity -= quantity;
    }

    // Update book quantity
    await connection.query(
      "UPDATE books SET quantity = ? WHERE id = ?",
      [newQuantity, book_id]
    );

    // Save transaction
    const [result] = await connection.query(
      `INSERT INTO transactions
      (book_id, user_id, book_title, member_name,
       transaction_type, quantity, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        book_id,
        user_id,
        book.title,
        user.name,
        transaction_type,
        quantity
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction: {
        id: result.insertId,
        book_id,
        user_id,
        book_title: book.title,
        member_name: user.name,
        transaction_type,
        quantity,
        remaining_books: newQuantity
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Create transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create transaction"
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;