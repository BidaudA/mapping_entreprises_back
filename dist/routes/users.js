"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await (0, database_1.query)('SELECT * FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await (0, database_1.query)('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
