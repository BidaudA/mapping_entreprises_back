"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// Get all technologies
/**
 * @swagger
 * /api/technologies:
 *   get:
 *     summary: Retrieve a list of technologies
 *     responses:
 *       200:
 *         description: A list of technologies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
    try {
        const result = await (0, database_1.query)(`
        SELECT * FROM technologies
      `);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * @swagger
 * /api/technologies/{type}:
 *   get:
 *     summary: Retrieve a technology by type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the technology
 *     responses:
 *       200:
 *         description: A technology object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Technology not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await (0, database_1.query)(`
        SELECT name FROM technologies WHERE type = $1
      `, [type]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Technology not found' });
        }
        else {
            res.json(result.rows);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
