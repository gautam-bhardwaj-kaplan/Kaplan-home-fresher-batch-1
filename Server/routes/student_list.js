import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
        const sql = `SELECT stud_id AS id, name FROM student ORDER BY name `;
        const [rows] = await db.execute(sql, [rowsPerPage, page * rowsPerPage]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Error fetching students.' });
    }
});


export default router;
