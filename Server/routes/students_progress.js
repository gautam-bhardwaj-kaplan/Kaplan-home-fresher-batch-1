import express from "express";
import db from "../db.js";

const router = express.Router();

// fetch students
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT stud_id, name, email FROM student");
    res.json(rows);
  } catch (err) {
    console.error("DB error (students):", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


// Courses with progress (with filters)

router.get("/:id/courses", async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_gt, status } = req.query; 

    let query = `
      SELECT 
          c.course_id,
          c.course_name,
          COUNT(t.topic_id) AS total_topics,
          SUM(CASE WHEN a.completion_date_topic IS NOT NULL THEN 1 ELSE 0 END) AS completed_topics,
          ROUND(SUM(CASE WHEN a.completion_date_topic IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(t.topic_id), 2) AS progress_percentage
      FROM student s
      JOIN course c ON s.course_id = c.course_id
      JOIN topic t ON c.course_id = t.course_id
      LEFT JOIN activity a ON s.stud_id = a.student_id AND t.topic_id = a.topic_id
      WHERE s.stud_id = ?
      GROUP BY c.course_id, c.course_name
    `;

    let params = [id];

    // Apply filters
    if (progress_gt) {
      query += " HAVING progress_percentage > ?";
      params.push(progress_gt);
    }

    if (status) {
      if (status === "completed") {
        query += progress_gt ? " AND progress_percentage = 100" : " HAVING progress_percentage = 100";
      }
      if (status === "pending") {
        query += progress_gt ? " AND progress_percentage < 100" : " HAVING progress_percentage < 100";
      }
    }

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error("DB error (courses):", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});


// Completed / Pending topics

router.get("/:id/course/:courseId/topics", async (req, res) => {
  try {
    const { id, courseId } = req.params;
    const [rows] = await db.query(`
      SELECT 
          t.topic_id,
          t.topic_name,
          CASE WHEN a.completion_date_topic IS NOT NULL THEN 'Completed' ELSE 'Pending' END AS status
      FROM topic t
      LEFT JOIN activity a 
          ON t.topic_id = a.topic_id AND a.student_id = ?
      WHERE t.course_id = ?;
    `, [id, courseId]);

    res.json(rows);
  } catch (err) {
    console.error("DB error (topics):", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

export default router;
