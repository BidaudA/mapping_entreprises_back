import { Router } from "express";
import { query } from "../config/database";
import { Company } from "../types";

const router = Router();



// Get all companies
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve a list of companies
 *     responses:
 *       200:
 *         description: A list of companies
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
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   technologies_back:
 *                     type: array
 *                     items:
 *                       type: string
 *                   technologies_front:
 *                     type: array
 *                     items:
 *                       type: string
 *                   technologies_cloud:
 *                     type: array
 *                     items:
 *                       type: string
 *                   types_postes:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get('/', async (req, res) => {
    try {
      const result = await query(`
        SELECT 
          c.*,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.type = 'Backend') as technologies_back,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.type = 'Frontend') as technologies_front,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.type = 'Cloud') as technologies_cloud,
          ARRAY_AGG(DISTINCT jt.name) as types_postes
        FROM companies c
        LEFT JOIN company_technologies ct ON c.id = ct.company_id
        LEFT JOIN technologies t ON ct.technology_id = t.id
        LEFT JOIN company_job_types cjt ON c.id = cjt.company_id
        LEFT JOIN job_types jt ON cjt.job_type_id = jt.id
        GROUP BY c.id
      `);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(result.rows);
      console.log(result.rows);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Delete a company

/**
 * @swagger
 * /api/companies/{id}:
 *  delete:
 *   summary: Delete a company
 *  parameters:
 *   - in: path
 *    name: id
 *   required: true
 *  schema:
 *  type: integer
 * responses:
 * 200:
 * description: Company deleted
 * 404:
 * description: Company not found
 * 500:
 * description: Internal server error
 * 
 **/
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM companies WHERE id = $1 ON CASCADE', [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Company not found' });
      } else {
        res.json({ message: 'Company deleted' });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update a company
  /**
   * @swagger
   * /api/companies/{id}:
   *   put:
   *     summary: Update a company
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Company updated
   *       404:
   *         description: Company not found
   *       500:
   *         description: Internal server error
   */
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const result = await query(
        'UPDATE companies SET name = $1, description = $2 WHERE id = $3',
        [name, description, id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Company not found' });
      } else {
        res.json({ message: 'Company updated' });
      }
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  export default router;