import React from "react";
import { Box, LinearProgress } from "@mui/material";
import "./CourseCardPb.css";

interface Course {
  course_id: number;
  course_name: string;
  progress_percentage: number;
  completed_topics: number;
  total_topics: number;
  avg_quiz_score?: number;
  total_hours_studied?: number;
}

interface CourseCardProps {
  courses: Course[];
}

const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
  return (
    <Box className="course-table-frame">
      <table className="course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Progress</th>
            <th>Quiz</th>
            <th>Hours</th>
            <th>Total Topics</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => {
            const pending = course.total_topics - course.completed_topics;
            return (
              <tr
                key={course.course_id}
                className={index % 2 === 0 ? "row-even" : "row-odd"}
              >
                <td>{course.course_name}</td>
                <td>
                  <Box className="progress-cell">
                    <LinearProgress
                      variant="determinate"
                      value={course.progress_percentage}
                      className="linear-bar-small"
                    />
                    <span className="progress-text-small">
                      {course.progress_percentage}%
                    </span>
                  </Box>
                </td>
                <td>{course.avg_quiz_score ?? "N/A"}%</td>
                <td>{course.total_hours_studied ?? 0} hrs</td>
                <td>{course.total_topics}</td>
                <td>{pending}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default CourseCard;
