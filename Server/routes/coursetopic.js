
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

// Get courses for a student
router.get("/students/:student_id/courses", async (req, res) => {
  try {
    const { student_id } = req.params;
    const [rows] = await db.query(
      `SELECT c.course_id, c.course_name
       FROM course c
       JOIN student s ON c.course_id = s.course_id
       WHERE s.stud_id = ?`,
      [student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
});

// Get topics for a student + course
router.get("/students/:student_id/courses/:course_id/topics", async (req, res) => {
  try {
    const { student_id, course_id } = req.params;
    const [rows] = await db.query(
      `SELECT DISTINCT t.topic_id, t.topic_name
       FROM topic t
       JOIN activity a ON t.topic_id = a.topic_id
       WHERE a.student_id = ? AND t.course_id = ?`,
      [student_id, course_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics", details: err.message });
  }
});

router.get("/students/:studentName/courses", async (req, res) => {
  const { studentName } = req.params;
  console.log("🔎 Request path:", req.path);
  console.log("➡️ Student name received from API:", studentName);

  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT c.course_id, c.course_name
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      JOIN course c ON t.course_id = c.course_id
      WHERE LOWER(s.name) = LOWER(?)
      `,
      [studentName.trim()] // trim spaces before passing
    );

    console.log("➡️ Query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

