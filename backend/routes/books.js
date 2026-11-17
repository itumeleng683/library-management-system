const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET: Retrieve all books
router.get("/", async (req, res) => {
    try {
        const [books] = await db.query(
            "SELECT * FROM books ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message
        });
    }
});

// GET: Retrieve one book
router.get("/:id", async (req, res) => {
    try {
        const [books] = await db.query(
            "SELECT * FROM books WHERE id = ?",
            [req.params.id]
        );

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            book: books[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error: error.message
        });
    }
});

// POST: Add a new book
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (
            !title?.trim() ||
            !author?.trim() ||
            !genre?.trim() ||
            !isbn?.trim() ||
            quantity === undefined ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid title, author, genre, ISBN and non-negative quantity"
            });
        }

        const [result] = await db.query(
            `INSERT INTO books
            (title, author, genre, isbn, quantity)
            VALUES (?, ?, ?, ?, ?)`,
            [
                title.trim(),
                author.trim(),
                genre.trim(),
                isbn.trim(),
                Number(quantity)
            ]
        );

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            bookId: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "A book with this ISBN already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to add book",
            error: error.message
        });
    }
});

// PUT: Update an existing book
router.put("/:id", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (
            !title?.trim() ||
            !author?.trim() ||
            !genre?.trim() ||
            !isbn?.trim() ||
            quantity === undefined ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter valid book details and quantity"
            });
        }

        const [result] = await db.query(
            `UPDATE books
             SET title = ?, author = ?, genre = ?,
                 isbn = ?, quantity = ?
             WHERE id = ?`,
            [
                title.trim(),
                author.trim(),
                genre.trim(),
                isbn.trim(),
                Number(quantity),
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This ISBN is already being used"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error.message
        });
    }
});

// DELETE: Delete a book
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM books WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error.message
        });
    }
});

module.exports = router;