import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling/Sidebarlc.css";

interface Student {
  stud_id: string;   // id from API
  name: string;      // student name
}

interface SidebarPbProps {
  onStudentSelect: (studentId: string) => void;
}

const SidebarPb: React.FC<SidebarPbProps> = ({ onStudentSelect }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<string | null>(null);

  // fetch students from API
  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:5000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleSelect = (student: Student) => {
    setActiveStudent(student.stud_id);
    onStudentSelect(student.name); // return ID to Dashboard
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Students</h3>
      <div className="sidebar-list">
        {students.map((student) => (
          <div
            key={student.stud_id}
            className={`sidebar-item ${
              activeStudent === student.stud_id ? "active" : ""
            }`}
            onClick={() => handleSelect(student)}
          >
            {student.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarPb;
