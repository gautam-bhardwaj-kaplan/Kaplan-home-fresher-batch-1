
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/courses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM course ORDER BY course_name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
});

router.get("/topics/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const [rows] = await db.query("SELECT * FROM topic WHERE course_id = ?", [course_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics", details: err.message });
  }
});

export default router;

