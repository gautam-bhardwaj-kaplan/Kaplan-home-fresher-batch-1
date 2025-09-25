import React, { useState, useEffect } from "react";
import Header from "../components/HeaderPb.tsx";
import SidebarPb from "../components/SidebarPb.tsx";
import Filters from "../components/Filters.tsx";
import LineChartView from "../components/LineChartView.tsx";
import "./dashboard.css";
import axios from "axios";

interface Student {
  stud_id: number;
  name: string;
}

interface Course {
  course_id: string;
  course_name: string;
}

interface Topic {
  topic_id: string;
  topic_name: string;
}

const Dashboard: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily");
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSelectedCourse(null);
    setSelectedTopic([]);
  };

  useEffect(() => {
    if (!selectedStudent) return;
    const fetchCourses = async () => {
      try {
        const courseRes = await axios.get<Course[]>(
          `http://localhost:5000/students/${selectedStudent.stud_id}/courses`
        );
        setCourses(courseRes.data);
        setSelectedCourse(null);
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent || !selectedCourse) {
      setTopics([]);
      setSelectedTopic([]);
      return;
    }
    const fetchTopics = async () => {
      try {
        const res = await axios.get<Topic[]>(
          `http://localhost:5000/students/${selectedStudent.stud_id}/courses/${selectedCourse}/topics`
        );
        setTopics(res.data);
        setSelectedTopic([]);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };
    fetchTopics();
  }, [selectedCourse, selectedStudent]);

  const handleSidebarToggle = (isOpen: boolean) => {
    const container = document.querySelector(".dashboard-container");
    if (!container) return;

    if (isOpen && window.innerWidth <= 768) {
      container.classList.add("sidebar-open");
    } else {
      container.classList.remove("sidebar-open");
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Line Chart" />

      <div className="dashboard-main">
        <div className="sidebar-wrapper">
          <SidebarPb
            selectedStudent={selectedStudent}
            onSelect={handleStudentSelect}
            onToggle={handleSidebarToggle}
          />
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
              studentId={selectedStudent?.stud_id.toString() ?? null}
              studentName={selectedStudent?.name ?? null}
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