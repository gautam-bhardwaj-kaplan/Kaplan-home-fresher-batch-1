import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/HeaderPb.tsx";
import Sidebar from "../components/Sidebarlc.tsx";
import Filters from "../components/Filters.tsx";
import LineChartView from "../components/LineChartView.tsx";
import "./dashboard.css";
import axios from "axios";

interface Course {
  course_id: string;
  course_name: string;
}

interface Topic {
  topic_id: string;
  topic_name: string;
}

const Dashboard: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleStudentSelect = useCallback(
    (studentId: string, studentName: string) => {
      setSelectedStudentId(studentId);
      setSelectedStudentName(studentName);
    },
    []
  );

  useEffect(() => {
    if (!selectedStudentId) return;
    const fetchCourses = async () => {
      try {
        const courseRes = await axios.get<Course[]>(
          `http://localhost:5000/students/${selectedStudentId}/courses`
        );
        setCourses(courseRes.data);
        setSelectedCourse(null);
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, [selectedStudentId]);

  useEffect(() => {
    if (!selectedStudentId || !selectedCourse) {
      setTopics([]);
      setSelectedTopic([]);
      return;
    }
    const fetchTopics = async () => {
      try {
        const res = await axios.get<Topic[]>(
          `http://localhost:5000/students/${selectedStudentId}/courses/${selectedCourse}/topics`
        );
        setTopics(res.data);
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };
    fetchTopics();
  }, [selectedCourse, selectedStudentId]);

  return (
    <div className="dashboard-container">
      <Header title="Line Chart" />

      <div className="dashboard-main">
        <div className="sidebar-wrapper">
          <Sidebar onStudentSelect={handleStudentSelect} />
        </div>
        <div className="dashboard-content">
          <div className="filters-section">
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
          </div>

          <div className="linechart-container">
            <LineChartView
              studentId={selectedStudentId}
              studentName={selectedStudentName}
              courseId={selectedCourse}
              TopicId={selectedTopic}
              timeframe={timeframe}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
