import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * DAILY study hours with optional filters
 */
router.get("/daily", async (req, res) => {
  try {
    const { student_id, course_id, topic_id } = req.query;

    if (!student_id) return res.status(400).json({ error: "student_id required" });

    let query = `
      SELECT a.completion_date_topic AS date, SUM(a.hours_studied) AS total_hours
      FROM activity a
      JOIN student s ON a.student_id = s.stud_id
      WHERE a.student_id = ?`;

    const params = [student_id];

    if (course_id) {
      query += " AND s.course_id = ?";
      params.push(course_id);
    }

    if (topic_id) {
      query += " AND a.topic_id = ?";
      params.push(topic_id);
    }

    query += " GROUP BY a.completion_date_topic ORDER BY a.completion_date_topic ASC";

    const [rows] = await db.query(query, params);

    res.json({ student_id, daily_hours: rows });
  } catch (err) {
    res.status(500).json({ error: "Daily data fetch failed", details: err.message });
  }
});

/**
 * WEEKLY study hours with optional filters
 */

router.get("/weekly", async (req, res) => {
  try {
    const { student_id, course_id, topic_id } = req.query;

    if (!student_id) return res.status(400).json({ error: "student_id required" });

    let query = `
      SELECT YEAR(a.completion_date_topic) AS year,
             WEEK(a.completion_date_topic, 1) AS week_number,
             SUM(a.hours_studied) AS total_hours
      FROM activity a
      JOIN student s ON a.student_id = s.stud_id
      WHERE a.student_id = ?`;

    const params = [student_id];

    if (course_id) {
      query += " AND s.course_id = ?";
      params.push(course_id);
    }

    if (topic_id) {
      query += " AND a.topic_id = ?";
      params.push(topic_id);
    }

    query += `
      GROUP BY YEAR(a.completion_date_topic), WEEK(a.completion_date_topic, 1)
      ORDER BY YEAR(a.completion_date_topic), WEEK(a.completion_date_topic, 1) ASC
    `;

    const [rows] = await db.query(query, params);

    // Convert week number to date range
    const formatted = rows.map(r => {
      // Get first day of week (Monday)
      const firstDay = new Date(r.year, 0, (r.week_number - 1) * 7 + 1);
      const dayOfWeek = firstDay.getDay();
      const monday = new Date(firstDay);
      monday.setDate(firstDay.getDate() - ((dayOfWeek + 6) % 7)); // adjust to Monday

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const options = { month: "short", day: "numeric" };
      return {
        week: `${monday.toLocaleDateString("en-US", options)} - ${sunday.toLocaleDateString("en-US", options)}, ${r.year}`,
        total_hours: r.total_hours
      };
    });

    res.json({ student_id, weekly_hours: formatted });
  } catch (err) {
    res.status(500).json({ error: "Weekly data fetch failed", details: err.message });
  }
});

export default router;



