import express from "express"
import db from '../db.js';

const router = express.Router();



router.get('/:studentId', async (req, res) => {
    try {
        
        const { studentId } = req.params;

        const sql = `
            SELECT 
                s.name AS studentName,
                c.course_name AS courseName,
                t.topic_name AS topicName,
                COALESCE(a.quiz_score, 0) AS score  
            FROM student s
            
            JOIN (
                SELECT DISTINCT c.course_id
                FROM activity a
                JOIN topic t ON a.topic_id = t.topic_id
                JOIN course c ON c.course_id = t.course_id
                WHERE a.student_id = ?
            ) sc ON 1=1
            JOIN course c ON c.course_id = sc.course_id
            JOIN topic t ON t.course_id = c.course_id
            LEFT JOIN activity a 
                ON a.student_id = s.stud_id 
               AND a.topic_id = t.topic_id
            WHERE s.stud_id = ?
            ORDER BY c.course_name, t.topic_name;
        `;

        const [rows] = await db.execute(sql, [studentId, studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No data found for this student.' });
        }

        res.json(rows);
    } catch (err) {
        console.error('Error fetching quiz scores:', err);
        res.status(500).json({ message: 'Error fetching quiz scores.' });
    }
});


export default router;
