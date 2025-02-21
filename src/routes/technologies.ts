import { Router } from "express";
import { query } from "../config/database";
import { Company } from "../types";

const router = Router();

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
      const result = await query(`
        SELECT * FROM technologies
      `);
      res.json(result.rows);
    } catch (error) {
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
      const result = await query(`
        SELECT name FROM technologies WHERE type = $1
      `, [type]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Technology not found' });
      } else {
        res.json(result.rows);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**
   * @swagger
   * /api/technologies:
   *   post:
   *     summary: Create a new technology
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               type:
   *                 type: string
   *     responses:
   *       201:
   *         description: Technology created successfully
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
   *       500:
   *         description: Internal Server Error
   */
  router.post('/', async (req, res) => {
    try {
      const name = req.body.name;
      const type = req.body.type;
      const result = await query(`
        INSERT INTO technologies (name, type)
        VALUES ($1, $2)
        RETURNING id
      `, [name, type]);
      console.log(result);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export default router;