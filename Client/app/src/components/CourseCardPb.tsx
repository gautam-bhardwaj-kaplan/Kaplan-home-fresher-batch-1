import React from "react";
import { Box, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import "./CourseCardPb.css";
import CourseTopicsDialog from "./CourseTopicsDialog.tsx";
import SegmentedProgressBar from "./SegmentedProgressBar.tsx";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

interface Course {
  course_id: number;
  course_name: string;
  progress_percentage: number;
  completed_topics: number;
  total_topics: number;
  avg_quiz_score?: number;
  total_hours_studied?: number;
  topics?: string[];
}

interface CourseCardProps {
  courses: Course[];
  studentId: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ courses, studentId }) => {
  const [open, setOpen] = React.useState(false);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | null>(
    null
  );
  const [selectedCourseName, setSelectedCourseName] = React.useState<
    string | null
  >(null);
  const [topicsMap, setTopicsMap] = React.useState<Record<number, any[]>>({});
  const [loadingTopics, setLoadingTopics] = React.useState<number | null>(null);

  const [expandedCourseId, setExpandedCourseId] = React.useState<number | null>(
    null
  );
  const [sortedCourses, setSortedCourses] = React.useState<Course[]>(courses);

  const handleToggleExpand = async (courseId: number) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(courseId);

    if (!topicsMap[courseId]) {
      try {
        setLoadingTopics(courseId);

        const res = await fetch(
          `http://localhost:5000/student/course/${courseId}/topics/names`
        );
        const data = await res.json();
        console.log("Fetched topic names:", data);
        setTopicsMap((prev) => ({ ...prev, [courseId]: data }));
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setTopicsMap((prev) => ({ ...prev, [courseId]: [] }));
      } finally {
        setLoadingTopics(null);
      }
    }
  };

  const handleSortByName = () => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (a.course_name < b.course_name) return sortAsc ? -1 : 1;
      if (a.course_name > b.course_name) return sortAsc ? 1 : -1;
      return 0;
    });
    setSortAsc(!sortAsc);
    setSortedCourses(sortedCourses);
  };

  React.useEffect(() => {
    setSortedCourses(courses);
  }, [courses]);

  return (
    <Box className="course-table-frame">
      <table className="course-table">
        <thead>
          <tr>
            <th>
              Course Name
              <IconButton size="small" onClick={handleSortByName}>
                {sortAsc ? (
                  <ArrowUpwardIcon fontSize="small" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" />
                )}
              </IconButton>
            </th>
            <th>Progress</th>
            <th>Quiz</th>
            <th>Hours</th>
            <th>Total Topics</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {sortedCourses.map((course, index) => {
            const pending = course.total_topics - course.completed_topics;
            const isExpanded = expandedCourseId === course.course_id;

            return (
              <React.Fragment key={course.course_id}>
                <tr className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  <td className="course-name-cell">
                    {course.course_name}
                    <IconButton
                      size="small"
                      className="toggle-topics-btn"
                      onClick={() => handleToggleExpand(course.course_id)}
                    >
                      {isExpanded ? (
                        <ArrowDropUpIcon fontSize="small" />
                      ) : (
                        <ArrowDropDownIcon fontSize="small" />
                      )}
                    </IconButton>
                  </td>

                  <td>
                    <Box className="progress-cell">
                      <SegmentedProgressBar
                        value={course.progress_percentage}
                      />
                    </Box>
                  </td>
                  <td>{course.avg_quiz_score ?? "N/A"}</td>
                  <td>{course.total_hours_studied ?? 0} </td>
                  <td
                    className="topics-cell clickable"
                    onClick={() => {
                      setSelectedCourseId(course.course_id);
                      setSelectedCourseName(course.course_name);
                      setOpen(true);
                    }}
                  >
                    {course.total_topics}
                  </td>
                  <td>{pending}</td>
                </tr>
                {isExpanded && (
                  <tr className="topics-row">
                    <td colSpan={6}>
                      {loadingTopics === course.course_id ? (
                        <p>Loading topics...</p>
                      ) : topicsMap[course.course_id]?.length ? (
                        <ul className="topics-list">
                          {topicsMap[course.course_id].map((t) => (
                            <li key={t.topic_id}>{t.topic_name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-topics-inline">
                          No topic names available
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {selectedCourseId && (
        <CourseTopicsDialog
          open={open}
          onClose={() => setOpen(false)}
          courseId={selectedCourseId}
          courseName={selectedCourseName!}
          studentId={studentId}
        />
      )}
    </Box>
  );
};

export default CourseCard;
