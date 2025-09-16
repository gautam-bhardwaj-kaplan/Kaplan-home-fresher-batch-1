import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/daily", async (req, res) => {
  try {
    const { student_name, course_name, topic_name } = req.query;

    if (!student_name) {
        return res.status(400).json({ error: "student_name required" });
    }

    let query = `
      SELECT DATE(a.completion_date_topic) AS date, SUM(a.hours_studied) AS total_hours
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      JOIN course c ON t.course_id = c.course_id
      WHERE LOWER(s.name) = LOWER(?)
    `;
    const params = [student_name];

    if (course_name) {     
      query += " AND LOWER(c.course_name) = LOWER(?)";
      params.push(course_name);
    }
    if (topic_name) {
      const topicList = topic_name.split(",").map(t => t.trim().toLowerCase());
      query += ` AND LOWER(t.topic_name) IN (${topicList.map(() => "?").join(",")})`;
      params.push(...topicList);
    }

    query += " GROUP BY DATE(a.completion_date_topic) ORDER BY DATE(a.completion_date_topic) ASC";

    const [rows] = await db.query(query, params);

    const formatted = rows.map((r) => {
      const localDate = new Date(r.date);
      const formattedDate = localDate.toLocaleDateString("en-CA");  
      return {
        date: formattedDate,
        total_hours: r.total_hours
      };
    });
    res.json(formatted);
  } catch (err) {
    console.error(" Daily fetch failed:", err);
    res.status(500).json({ error: "Daily data fetch failed", details: err.message });
  }
});


router.get("/weekly", async (req, res) => {
  try {
    const { student_name, course_name, topic_name } = req.query;
    if (!student_name) return res.status(400).json({ error: "student_name required" });

    let query = `
      SELECT 
        YEARWEEK(a.completion_date_topic, 3) AS year_week, 
        MIN(DATE(a.completion_date_topic)) AS min_date,
        MAX(DATE(a.completion_date_topic)) AS max_date,
        SUM(a.hours_studied) AS total_hours
      FROM student s
      JOIN activity a ON s.stud_id = a.student_id
      JOIN topic t ON a.topic_id = t.topic_id
      JOIN course c ON t.course_id = c.course_id
      WHERE LOWER(s.name) = LOWER(?)
    `;
    const params = [student_name];

    if (course_name) {
      query += " AND LOWER(c.course_name) = LOWER(?)";
      params.push(course_name);
    }
    if (topic_name) {
      const topicList = topic_name.split(",").map(t => t.trim().toLowerCase());
      query += ` AND LOWER(t.topic_name) IN (${topicList.map(() => "?").join(",")})`;
      params.push(...topicList);
    }

    query += `
      GROUP BY YEARWEEK(a.completion_date_topic, 3)
      ORDER BY YEARWEEK(a.completion_date_topic, 3) ASC
    `;

    const [rows] = await db.query(query, params);

    const formatted = rows.map(r => {
      const yearWeek = r.year_week.toString();
      const year = parseInt(yearWeek.slice(0, 4));
      const week = parseInt(yearWeek.slice(4));

      const simple = new Date(year, 0, 1 + (week - 1) * 7);
      const dayOfWeek = simple.getDay();
      const isoWeekStart = new Date(simple);
      if (dayOfWeek <= 4) {
        isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1); 
      } else {
        isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay()); 
      }

      const isoWeekEnd = new Date(isoWeekStart);
      isoWeekEnd.setDate(isoWeekStart.getDate() + 6);

      const options = { month: "short", day: "numeric" };
      return {
        week: `${isoWeekStart.toLocaleDateString("en-US", options)} - ${isoWeekEnd.toLocaleDateString("en-US", options)}, ${year}`,
        total_hours: r.total_hours
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(" Weekly fetch failed:", err);
    res.status(500).json({ error: "Weekly data fetch failed", details: err.message });
  }
});

export default router;
