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
  const connection = await db.getConnection();
  try {
    const { stud_id } = req.params;
    await connection.beginTransaction();
    const [studentRows] = await connection.query(
      "SELECT * FROM student WHERE stud_id = ?",
      [stud_id]
    );
    if (studentRows.length === 0) {
      await connection.release();
      return res.status(404).json({ error: "Student not found" });
    }
    const student = studentRows[0];
    const today = new Date();
    const archived_at = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    await connection.query(
      `INSERT INTO archived_students (stud_id, name, email, course_id, archived_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        student.stud_id,
        student.name,
        student.email,
        student.course_id,
        archived_at,
      ]
    );
    console.log("Student archived");
    const [activities] = await connection.query(
      "SELECT * FROM activity WHERE student_id = ?",
      [stud_id]
    );
    for (const activity of activities) {
      await connection.query(
        `INSERT INTO archived_activities
          (activity_id, student_id, topic_id, hours_studied, quiz_score, completion_date_topic, archived_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          activity.activity_id,
          activity.student_id,
          activity.topic_id,
          activity.hours_studied,
          activity.quiz_score,
          activity.completion_date_topic,
          archived_at,
        ]
      );
    }
    await connection.query("DELETE FROM activity WHERE student_id = ?", [
      stud_id,
    ]);
    await connection.query("DELETE FROM student WHERE stud_id = ?", [stud_id]);
    await connection.commit();
    await connection.release();
    res.json({ message: "Student deleted and archived successfully" });
  } catch (err) {
    await connection.rollback();
    await connection.release();
    res
      .status(500)
      .json({ error: "Failed to delete student", details: err.message });
  }
});
router.get("/archived-students", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT stud_id, name, email, archived_at FROM archived_students ORDER BY archived_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch archived students" });
  }
});
router.post("/restore-student/:stud_id", async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { stud_id } = req.params;
    await connection.beginTransaction();
    const [studentRows] = await connection.query(
      "SELECT * FROM archived_students WHERE stud_id = ?",
      [stud_id]
    );
    if (studentRows.length === 0) {
      await connection.release();
      return res.status(404).json({ error: "Archived student not found" });
    }
    const student = studentRows[0];
    await connection.query(
      "INSERT INTO student (stud_id, name, email, course_id) VALUES (?, ?, ?, ?)",
      [student.stud_id, student.name, student.email, student.course_id]
    );
    const [activities] = await connection.query(
      "SELECT * FROM archived_activities WHERE student_id = ?",
      [stud_id]
    );
    for (const act of activities) {
      await connection.query(
        `INSERT INTO activity (activity_id, student_id, topic_id, hours_studied, quiz_score, completion_date_topic)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          act.activity_id,
          act.student_id,
          act.topic_id,
          act.hours_studied,
          act.quiz_score,
          act.completion_date_topic,
        ]
      );
    }
    await connection.query(
      "DELETE FROM archived_activities WHERE student_id = ?",
      [stud_id]
    );
    await connection.query("DELETE FROM archived_students WHERE stud_id = ?", [
      stud_id,
    ]);
    await connection.commit();
    await connection.release();
    res.json({ message: "Student restored successfully" });
  } catch (err) {
    await connection.rollback();
    await connection.release();
    console.error(err);
    res.status(500).json({ error: "Failed to restore student" });
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
