import React, { useState, useEffect } from "react";
import "./SidebarPb.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonIcon from "@mui/icons-material/Person";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Student {
  stud_id: number;
  name: string;
}

interface SidebarPbProps {
  students: Student[];
  onSelect: (student: Student) => void;
  selectedStudent: Student | null;
}

const SidebarPb: React.FC<SidebarPbProps> = ({
  students,
  onSelect,
  selectedStudent,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {open && <h3 className="sidebar-title">Students</h3>}

        <div className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </div>
      </div>

      <div className="sidebar-list">
        {students.map((student) => (
          <div
            key={student.stud_id}
            className={`sidebar-item ${
              selectedStudent?.stud_id === student.stud_id ? "active" : ""
            }`}
            onClick={() => onSelect(student)}
          >
            <PersonIcon className="student-icon" />
            {open ? student.name : student.name.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SidebarPb;
