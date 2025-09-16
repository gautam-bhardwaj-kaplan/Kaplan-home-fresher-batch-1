import React, { useState, useEffect, useCallback } from "react";
import { Box, Container } from "@mui/material";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebarlc.tsx";
import Filters from "../components/Filters.tsx";
import LineChartView from "../components/LineChartView.tsx"; 
import "./dashboard.css";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");

  const [courses, setCourses] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  
  const handleStudentSelect = useCallback((studentName: string) => {
    setSelectedStudent(studentName);
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedStudent) return;

      try {
        const courseRes = await axios.get(
          `http://localhost:5000/students/${selectedStudent}/courses`
        );
        setCourses(courseRes.data.map((c: any) => c.course_name));
        setSelectedCourse(null);
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedStudent || !selectedCourse) {
        setTopics([]);
        setSelectedTopic([]);
        return;
      }

      try {
        const topicRes = await axios.get(
          `http://localhost:5000/students/${selectedStudent}/courses/${selectedCourse}/topics`
        );
        setTopics(topicRes.data.map((t: any) => t.topic_name));
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };
    fetchTopics();
  }, [selectedCourse, selectedStudent]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
<div className="dashboard-main">
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar onStudentSelect={handleStudentSelect} />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <Filters
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              courses={courses}
              topics={topics}
            />

            <Box sx={{ mt: 4 }}>
              <LineChartView
                studentName={selectedStudent}
                courseName={selectedCourse}
                selectedTopic={selectedTopic}
                timeframe={timeframe}
              />
            </Box>
          </Container>
        </Box>
      </Box>
      </div>
    </Box>
    
  );
};

export default Dashboard;
