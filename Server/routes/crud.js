import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * CREATE complete student
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, course_id, topic_id, quiz_score, hours_studied, completion_date_topic } = req.body;

    if (!name || !email || !course_id || !topic_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [studentResult] = await db.query(
      "INSERT INTO student (name, email, course_id) VALUES (?, ?, ?)",
      [name, email, course_id]
    );

    const stud_id = studentResult.insertId;

    await db.query(
      "INSERT INTO activity (student_id, topic_id, quiz_score, hours_studied, completion_date_topic) VALUES (?, ?, ?, ?, ?)",
      [
        stud_id,
        topic_id,
        quiz_score ?? null,
        hours_studied ?? null,
        completion_date_topic ?? null
      ]
    );

    res.json({ message: "Student complete data created ", stud_id });
  } catch (err) {
    res.status(500).json({ error: "Create failed ", details: err.message });
  }
});

/**
 * UPDATE complete student 
 */
router.put("/:id", async (req, res) => {
  try {
    const stud_id = req.params.id;
    const { email, course_id, topic_id, quiz_score, hours_studied, completion_date_topic } = req.body;

    await db.query(
      "UPDATE student SET email = ?, course_id = ? WHERE stud_id = ?",
      [email, course_id, stud_id]
    );

    await db.query(
      "UPDATE activity SET topic_id = ?, quiz_score = ?, hours_studied = ?, completion_date_topic = ? WHERE student_id = ?",
      [topic_id, quiz_score, hours_studied, completion_date_topic, stud_id]
    );

    res.json({ message: "Student complete data updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed ", details: err.message });
  }
});

/**
 * DELETE student
 */
router.delete("/:id", async (req, res) => {
  try {
    const stud_id = req.params.id;

    await db.query("DELETE FROM activity WHERE student_id = ?", [stud_id]);

    await db.query("DELETE FROM student WHERE stud_id = ?", [stud_id]);

    res.json({ message: "Student is deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed ", details: err.message });
  }
});

export default router;
