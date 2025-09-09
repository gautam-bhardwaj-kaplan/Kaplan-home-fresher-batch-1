import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Filters from "../components/Filters.tsx";
import LineChart from "../components/LineChartView.tsx";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");

  const [courses, setCourses] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  // useEffect to fetch courses when a student is selected.
  // This is the primary point of failure in your original code.
  useEffect(() => {
    const fetchCourses = async () => {
      // If no student is selected, do nothing.
      if (!selectedStudent) return;

      try {
        const courseRes = await axios.get(
          `http://localhost:5000/students/${selectedStudent}/courses`
        );
        // Set the courses state with the fetched data.
        setCourses(courseRes.data.map((c: any) => c.course_name));
        // Reset course and topic selection when a new student is chosen.
          setSelectedCourse(null);
          setSelectedTopic(null);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, [selectedStudent]);

  // useEffect to fetch topics when a course is selected.
  useEffect(() => {
    const fetchTopics = async () => {
      // If no student or no course is selected, clear topics and return.
      if (!selectedStudent || !selectedCourse) {
        setTopics([]); // Clear the topics list if there's no selected course
        return;
      }

      try {
        const topicRes = await axios.get(
          `http://localhost:5000/students/${selectedStudent}/courses/${selectedCourse}/topics`
        );
        // Set the topics state with the fetched data.
        setTopics(topicRes.data.map((t: any) => t.topic_name));
        // Reset topic selection when a new course is chosen.
         setSelectedTopic(null);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };
    fetchTopics();
  }, [selectedCourse, selectedStudent]); // Depend on both course and student

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar onStudentSelect={(id) => setSelectedStudent(id)} />

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <Filters
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              courses={courses} // Pass the courses state
              topics={topics} // Pass the topics state
            />

            <Box sx={{ mt: 4 }}>
              <LineChart
                studentId={selectedStudent}
                courseId={selectedCourse}
                topicId={selectedTopic}
                timeframe={timeframe}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;