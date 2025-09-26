import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let search = req.query.search || "";
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(limit) || limit <= 0 || limit > 100) limit = 10;

    const offset = page * limit;
    let countQuery = "SELECT COUNT(*) AS total FROM student";
    const countParams = [];
    if (search) {
      countQuery +=
        " WHERE CAST(stud_id AS CHAR) LIKE ? OR name LIKE ? OR email LIKE ?";
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [countRows] = await db.query(countQuery, countParams);
    const total = countRows[0].total;

    let fetchQuery = "SELECT stud_id, name, email FROM student";
    const fetchParams = [];
    if (search) {
      fetchQuery +=
        "  WHERE CAST(stud_id AS CHAR) LIKE ? OR name  LIKE ? OR email LIKE ?";
      fetchParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    fetchQuery += " ORDER BY stud_id LIMIT ? OFFSET ?";
    fetchParams.push(limit, offset);

    const [rows] = await db.query(fetchQuery, fetchParams);

    res.json({
      students: rows,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;
