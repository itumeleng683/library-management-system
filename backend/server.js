require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const booksRoutes = require("./routes/books");
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/books", booksRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/users", usersRoutes);

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Library Management System API"
    });
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Library Management API is running successfully"
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Library Management API running on port ${PORT}`);

    try{
        const connection = await db.getConnection();

        console.log("MySQL database connected successfully");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:",
        error.message);
    }
});