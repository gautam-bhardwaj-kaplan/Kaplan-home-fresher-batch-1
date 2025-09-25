import express from "express";
import db from "../db.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 0, 0);
    const rowsPerPage = Math.max(Number.parseInt(req.query.rowsPerPage, 10) || 10, 1);
    const offset = page * rowsPerPage;
    const sql = `
      SELECT stud_id AS id, name
      FROM student
      ORDER BY name ASC
       LIMIT ${rowsPerPage} OFFSET ${offset}
    `;
    const [rows] = await db.execute(sql);
    const [countResult] = await db.execute(`SELECT COUNT(*) AS total FROM student;`);
    const total = countResult[0].total;
    res.json({ rows, total });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Error fetching students." });
  }
});
export default router;