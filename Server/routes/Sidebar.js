import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit <= 0 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const [countRows] = await db.query("SELECT COUNT(*) AS total FROM student");
    const total = countRows[0].total;
    const [rows] = await db.query(
      "SELECT stud_id, name, email FROM student ORDER BY name ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      students: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("DB error (fetch students for sidebar):", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;
