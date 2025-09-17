import express from "express";
import db from "../db.js";
import { validateParams } from "../Validate Parameter/ValidateParameters.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { student_name, email, course_name, topics } = req.body;

  if (!student_name || !email || !course_name || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: "Student name, email, course name and at least one topic are required." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction(); 
    let [course] = await connection.query(
      "SELECT course_id FROM course WHERE course_name = ?",
      [course_name]
    );

    let courseId;
    if (course.length > 0) {
      courseId = course[0].course_id;
    } else {
      let result = await connection.query(
        "INSERT INTO course (course_name) VALUES (?)",
        [course_name]
      );
      courseId = result[0].insertId;
    }

   
    let [student] = await connection.query(
      "SELECT stud_id FROM student WHERE email = ?",
      [email]
    );

    let studentId;
    if (student.length > 0) {
      studentId = student[0].stud_id;
    } else {
      let result = await connection.query(
        "INSERT INTO student (name, email, course_id) VALUES (?, ?, ?)",
        [student_name, email, courseId]
      );
      studentId = result[0].insertId;
    }

    
    for (const { topic_name, quiz_score, hours_studied, completion_date } of topics) {
      if (!topic_name || !quiz_score || !hours_studied || !completion_date) {
        throw new Error("Each topic must have topic_name, quiz_score, hours_studied, and completion_date");
      }

     
      let [topic] = await connection.query(
        "SELECT topic_id FROM topic WHERE topic_name = ? AND course_id = ?",
        [topic_name, courseId]
      );

      let topicId;
      if (topic.length > 0) {
        topicId = topic[0].topic_id;
      } else {
        let result = await connection.query(
          "INSERT INTO topic (topic_name, course_id) VALUES (?, ?)",
          [topic_name, courseId]
        );
        topicId = result[0].insertId;
      }

      
      await connection.query(
        "INSERT INTO activity (student_id, topic_id, hours_studied, quiz_score, completion_date_topic) VALUES (?, ?, ?, ?, ?)",
        [studentId, topicId, hours_studied, quiz_score, completion_date]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Student and topics created successfully." });
  } catch (err) {
    await connection.rollback();
    console.error("Error creating student activity:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    connection.release();
  }
});

router.get("/courses", async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM course");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
});


router.get("/topics/:courseId", async (req, res) => {
  
  const validation = validateParams(["courseId"], req.params);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const { courseId } = req.params;
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT * FROM topic WHERE course_id = ?",
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No topics found for this course" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
});

export default router;
