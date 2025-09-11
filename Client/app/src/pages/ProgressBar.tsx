import React, { useEffect, useState } from "react";
import HeaderPb from "../components/HeaderPb.tsx";
import SidebarPb from "../components/SidebarPb.tsx";
import FiltersPb from "../components/FiltersPb.tsx";
import CourseCard from "../components/CourseCardPb.tsx";
import axios from "axios";
import "./ProgressBar.css";

interface Student {
  stud_id: number;
  name: string;
}

interface Course {
  course_id: number;
  course_name: string;
  progress_percentage: number;
  completed_topics: number;
  total_topics: number;
  total_hours_studied: number; 
  avg_quiz_score: number;
}

const ProgressBar: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch students
  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:5000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Fetch courses for selected student
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    axios
      .get<Course[]>(`http://localhost:5000/student/${student.stud_id}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  };

  return (
    <>
      <HeaderPb />
      <div className="progressbar-container">
        <SidebarPb students={students} onSelect={handleStudentSelect} />
        <div className="progressbar-content">
          <FiltersPb
            onCompletionFilter={(val) => console.log("Completion filter:", val)}
            onSortFilter={(val) => console.log("Sort filter:", val)}
            onNavigate={(page) => console.log("Navigate to:", page)}
          />

          <div className="courses-frame">
            {selectedStudent === null ? (
            <p>Select a student to view courses</p>
            ) : courses.length === 0 ? (
          <p>No courses found for {selectedStudent.name}</p>
) : (
  <CourseCard courses={courses} />
)}

          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
