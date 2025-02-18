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
      res.setHeader('Content-Type', 'application/json; charset=UTF8');
      res.json(result.rows);
      console.log(result.rows);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
     * Deletes a company from the database by its ID.
     * 
     * @param {number} id - The ID of the company to delete.
     * @returns {Promise<QueryResult>} The result of the delete operation.
     * 
     * @example
     * // Example usage:
     * const result = await query('DELETE FROM companies WHERE id = $1 ON CASCADE', [id]);
     * 
     * @swagger
     * /companies/{id}:
     *   delete:
     *     summary: Delete a company by ID
     *     description: Deletes a company from the database by its ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The ID of the company to delete
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Company successfully deleted
     *       404:
     *         description: Company not found
     *       500:
     *         description: Internal server error
     */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM companies WHERE id = $1', [id]);
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
/**
 * Inserts a technology for a company into the database.
 *
 * @param technology - The name of the technology to insert.
 * @param type - The type of the technology.
 * @returns A promise that resolves when the technology has been inserted.
 *
 * @throws Will throw an error if the database query fails.
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, technologies_back, technologies_front, technologies_cloud } = req.body;
    console.log(technologies_back, technologies_front, technologies_cloud);
    await query('BEGIN');

    const result = await query(
      'UPDATE companies SET name = $1, description = $2 WHERE id = $3',
      [name, description, id]
    );

    if (result.rowCount === 0) {
      await query('ROLLBACK');
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    await query('DELETE FROM company_technologies WHERE company_id = $1', [id]);

    
    const insertTechnology = async (technology: string, type: string) => {
      const techResult = await query('SELECT id FROM technologies WHERE name = $1 AND type = $2', [technology, type]);
      if (techResult.rows.length > 0) {
        await query('INSERT INTO company_technologies (company_id, technology_id) VALUES ($1, $2)', [id, techResult.rows[0].id]);
      }
    };

    for (const tech of technologies_back) {
      await insertTechnology(tech, 'Backend');
    }
    for (const tech of technologies_front) {
      await insertTechnology(tech, 'Frontend');
    }
    for (const tech of technologies_cloud) {
      await insertTechnology(tech, 'Cloud');
    }

    await query('COMMIT');
    res.json({ message: 'Company updated' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     description: Updates a company's details and associated technologies by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the company to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: company
 *         description: The company data to update
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             technologies_back:
 *               type: array
 *               items:
 *                 type: string
 *             technologies_front:
 *               type: array
 *               items:
 *                 type: string
 *             technologies_cloud:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company successfully updated
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const { name, description,latitude, longitude, adress, technologies_back, technologies_front, technologies_cloud } = req.body;

    await query('BEGIN');

    const result = await query(
      'INSERT INTO companies (name, description, latitude, longitude, adress) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, description, latitude, longitude, adress]
    );

    const companyId = result.rows[0].id;

    const insertTechnology = async (technology: string, type: string) => {
      const techResult = await query('SELECT id FROM technologies WHERE name = $1 AND type = $2', [technology, type]);
      if (techResult.rows.length > 0) {
        await query('INSERT INTO company_technologies (company_id, technology_id) VALUES ($1, $2)', [companyId, techResult.rows[0].id]);
      }
    };

    for (const tech of technologies_back) {
      await insertTechnology(tech, 'Backend');
    }
    for (const tech of technologies_front) {
      await insertTechnology(tech, 'Frontend');
    }
    for (const tech of technologies_cloud) {
      await insertTechnology(tech, 'Cloud');
    }

    await query('COMMIT');
    res.status(201).json({ message: 'Company created', companyId });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  export default router;