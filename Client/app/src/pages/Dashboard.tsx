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

  const [courses, setCourses] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // Fetch courses & topics when student changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStudent) return;

      try {
        const courseRes = await axios.get(
          `http://localhost:5000/student/${selectedStudent}/courses`
        );
        setCourses(courseRes.data);

        const topicRes = await axios.get(
          `http://localhost:5000/student/${selectedStudent}/topics`
        );
        setTopics(topicRes.data);
      } catch (err) {
        console.error("Failed to fetch courses/topics", err);
      }
    };

    fetchData();
  }, [selectedStudent]);

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
              courses={courses}   // ✅ pass only student’s courses
              topics={topics}     // ✅ pass only student’s topics
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
