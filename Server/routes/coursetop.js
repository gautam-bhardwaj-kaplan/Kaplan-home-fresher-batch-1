import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all courses for a given student
router.get("/students/:studentName/courses", async (req, res) => {
  const { studentName } = req.params;
  console.log("➡️ Looking up courses for:", studentName);

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
      [studentName]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ SQL error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get topics for a given student + course
router.get("/students/:studentName/courses/:courseId/topics", async (req, res) => {
  const { studentName, courseId } = req.params;
  console.log("➡️ Looking up topics for:", studentName, "in course:", courseId);

  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT t.topic_id, t.topic_name
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      WHERE LOWER(s.name) = LOWER(?) AND t.course_id = ?
      `,
      [studentName, courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ SQL error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
