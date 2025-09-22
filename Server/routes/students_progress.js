import express from "express";
import db from "../db.js";
import { validateParams } from "../Validate Parameter/ValidateParameters.js";

const router = express.Router();

// fetch students for home
router.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(limit) || limit <= 0 || limit > 100) limit = 10;

    const offset = page * limit;
    const [countRows] = await db.query("SELECT COUNT(*) AS total FROM student");
    const total = countRows[0].total;

    const [rows] = await db.query(
      "SELECT stud_id, name, email FROM student ORDER BY stud_id LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      students: rows,
      total,
    });
  } catch (err) {
    console.error("DB error (students):", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Courses with progress (with filters)

router.get("/:id/courses", async (req, res) => {
  try {
    const validation = validateParams(["id"], req.params);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    const { id } = req.params;
    const { progress_gt, status } = req.query;

    let query = `
  SELECT 
      c.course_id,
      c.course_name,
      COUNT(t.topic_id) AS total_topics,
      SUM(CASE WHEN a.completion_date_topic IS NOT NULL THEN 1 ELSE 0 END) AS completed_topics,
      ROUND(SUM(CASE WHEN a.completion_date_topic IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(t.topic_id), 2) AS progress_percentage,
      COALESCE(SUM(a.hours_studied), 0) AS total_hours_studied,
      COALESCE(ROUND(AVG(a.quiz_score), 2), 0) AS avg_quiz_score
  FROM course c
  JOIN topic t ON c.course_id = t.course_id
  LEFT JOIN activity a ON t.topic_id = a.topic_id AND a.student_id = ?
  GROUP BY c.course_id, c.course_name
`;

    let params = [id];

  
    if (progress_gt) {
      query += " HAVING progress_percentage > ?";
      params.push(progress_gt);
    }

    if (status) {
      if (status === "completed") {
        query += progress_gt
          ? " AND progress_percentage = 100"
          : " HAVING progress_percentage = 100";
      }
      if (status === "pending") {
        query += progress_gt
          ? " AND progress_percentage < 100"
          : " HAVING progress_percentage < 100";
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
    const validation = validateParams(["id", "courseId"], req.params);
    if (!validation.valid)
      return res.status(400).json({ error: validation.message });

    const { id, courseId } = req.params;
    const [rows] = await db.query(
      `
      SELECT 
          t.topic_id,
          t.topic_name,
          CASE WHEN a.completion_date_topic IS NOT NULL THEN 'Completed' ELSE 'Pending' END AS status
      FROM topic t
      LEFT JOIN activity a 
          ON t.topic_id = a.topic_id AND a.student_id = ?
      WHERE t.course_id = ?;
    `,
      [id, courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB error (topics):", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Completed / Pending topics with quiz score
router.get("/:studentId/course/:courseId/topics/details", async (req, res) => {
  try {
    const validation = validateParams(["studentId", "courseId"], req.params);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const { studentId, courseId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
          t.topic_id,
          t.topic_name,
          COALESCE(a.quiz_score, 'Not started') AS quiz_score,
          CASE WHEN a.completion_date_topic IS NOT NULL THEN 'Completed' ELSE 'Pending' END AS status
      FROM topic t
      LEFT JOIN activity a
          ON t.topic_id = a.topic_id AND a.student_id = ?
      WHERE t.course_id = ?;
      `,
      [studentId, courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB error (topics):", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});
// fetch students for sidebar
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT stud_id, name FROM student ORDER BY name ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error (fetch students):", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.get("/courses/enrollment", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.course_id,
        c.course_name,
        COALESCE(COUNT(DISTINCT a.student_id), 0) AS student_count
      FROM course c
      LEFT JOIN topic t ON t.course_id = c.course_id
      LEFT JOIN activity a ON a.topic_id = t.topic_id
      GROUP BY c.course_id, c.course_name
      ORDER BY student_count DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("DB error (courses enrollment):", err);
    res.status(500).json({ error: "Failed to fetch course enrollment" });
  }
});
export default router;
