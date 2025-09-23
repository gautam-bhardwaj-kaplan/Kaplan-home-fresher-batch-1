import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "./styling/Sidebarlc.css";
import PersonIcon from "@mui/icons-material/Person";

interface Student {
  stud_id: string;
  name: string;
}

interface SidebarPbProps {
  onStudentSelect: (studentId: string, studentName: string) => void;
}

const SidebarLc: React.FC<SidebarPbProps> = ({ onStudentSelect }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:5000/student/all")
      .then((res) => {
        setStudents(res.data);

        if (res.data.length > 0) {
          setActiveStudent(res.data[0].stud_id);
          onStudentSelect(res.data[0].stud_id, res.data[0].name);
        }
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, [onStudentSelect]);

  const handleSelect = (student: Student) => {
    setActiveStudent(student.stud_id);
    onStudentSelect(student.stud_id, student.name);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "isOpen" : "closed"}`}>
      <div className="sidebar-content">
        {isOpen && <h3 className="sidebar-title">Students</h3>}
        <div className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </div>
      </div>

      <div className="sidebar-list">
        {students.map((student) => (
          <div
            key={student.stud_id}
            className={`sidebar-item ${
              activeStudent === student.stud_id ? "active" : ""
            }`}
            onClick={() => handleSelect(student)}
          >
            <PersonIcon className="student-icon" />
            {isOpen ? student.name : student.name.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarLc;
