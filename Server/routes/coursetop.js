import express from "express";
import db from "../db.js";

const router = express.Router();

// For the course filter
router.get("/students/:studentId/courses", async (req, res) => {
  const { studentId } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT c.course_id, c.course_name
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      JOIN course c ON t.course_id = c.course_id
      WHERE s.stud_id = ?
      `,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for the topics filter
router.get(
  "/students/:studentId/courses/:courseId/topics",
  async (req, res) => {
    const { studentId, courseId } = req.params;
    try {
      const [rows] = await db.query(
        `
      SELECT DISTINCT t.topic_id, t.topic_name
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      JOIN course c ON t.course_id = c.course_id
      WHERE s.stud_id = ? AND c.course_id = ?
      `,
        [studentId, courseId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/courses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM course ORDER BY course_name");
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch courses", details: err.message });
  }
});

router.get("/topics/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const [rows] = await db.query("SELECT * FROM topic WHERE course_id = ?", [
      course_id,
    ]);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch topics", details: err.message });
  }
});

router.get("/activity/:student_id/:topic_id", async (req, res) => {
  try {
    const { student_id, topic_id } = req.params;
    const [rows] = await db.query(
      "SELECT hours_studied, quiz_score, completion_date_topic FROM activity WHERE student_id = ? AND topic_id = ?",
      [student_id, topic_id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        hours_studied: null,
        quiz_score: null,
        completion_date_topic: null,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch activity", details: err.message });
  }
});

// Edit button
router.post("/activity", async (req, res) => {
  try {
    const {
      student_id,
      topic_id,
      hours_studied,
      quiz_score,
      completion_date_topic,
    } = req.body;

    if (!student_id || !topic_id) {
      return res
        .status(400)
        .json({ error: "student_id and topic_id are required" });
    }

    const [existing] = await db.query(
      "SELECT 1 FROM activity WHERE student_id = ? AND topic_id = ?",
      [student_id, topic_id]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE activity 
         SET hours_studied = ?, quiz_score = ?, completion_date_topic = ?
         WHERE student_id = ? AND topic_id = ?`,
        [hours_studied, quiz_score, completion_date_topic, student_id, topic_id]
      );
      res.json({ message: "Activity updated successfully" });
    } else {
      await db.query(
        `INSERT INTO activity (student_id, topic_id,hours_studied, quiz_score, completion_date_topic) 
         VALUES (?, ?, ?, ?, ?)`,
        [student_id, topic_id, hours_studied, quiz_score, completion_date_topic]
      );
      res.json({ message: "Activity created successfully" });
    }
  } catch (err) {
    console.error("Error saving activity:", err);
    res
      .status(500)
      .json({ error: "Failed to save activity", details: err.message });
  }
});

router.delete("/student/:stud_id", async (req, res) => {
  try {
    const { stud_id } = req.params;
    const [student] = await db.query(
      "SELECT * FROM student WHERE stud_id = ?",
      [stud_id]
    );
    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    await db.query("DELETE FROM activity WHERE student_id = ?", [stud_id]);
    await db.query("DELETE FROM student WHERE stud_id = ?", [stud_id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete student", details: err.message });
  }
});

router.put("/students/:stud_id", async (req, res) => {
  try {
    const { stud_id } = req.params;
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await db.query("UPDATE student SET name = ? ,email = ? WHERE stud_id = ?", [
      name,
      email,
      stud_id,
    ]);

    res.json({ message: "Student name and email updated successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update student name & email",
      details: err.message,
    });
  }
});

export default router;
