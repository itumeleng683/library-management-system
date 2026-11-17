const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET: Retrieve all users
router.get("/", async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, membership_id, role, created_at FROM users ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: error.message
        });
    }
});

// GET: Retrieve one user
router.get("/:id", async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, membership_id, role, created_at FROM users WHERE id = ?",
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user",
            error: error.message
        });
    }
});

// POST: Add a new user
router.post("/", async (req, res) => {
    try {
        const { name, membership_id, role } = req.body;

        if (!name?.trim() || !membership_id?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name and membership ID are required"
            });
        }

        const userRole = role?.trim() || "Member";

        const [result] = await db.query(
            `INSERT INTO users (name, membership_id, role)
             VALUES (?, ?, ?)`,
            [name.trim(), membership_id.trim(), userRole]
        );

        res.status(201).json({
            success: true,
            message: "User added successfully",
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This membership ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to add user",
            error: error.message
        });
    }
});

// PUT: Update an existing user
router.put("/:id", async (req, res) => {
    try {
        const { name, membership_id, role } = req.body;

        if (!name?.trim() || !membership_id?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name and membership ID are required"
            });
        }

        const userRole = role?.trim() || "Member";

        const [result] = await db.query(
            `UPDATE users
             SET name = ?, membership_id = ?, role = ?
             WHERE id = ?`,
            [name.trim(), membership_id.trim(), userRole, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This membership ID is already in use"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
});

// DELETE: Delete a user
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM users WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
});

module.exports = router;