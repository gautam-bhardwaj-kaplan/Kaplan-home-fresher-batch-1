import React, { useState } from "react";
import "./SidebarPb.css";

interface Student {
  stud_id: number;
  name: string;
}

interface SidebarPbProps {
  students: Student[];
  onSelect: (student: Student) => void;
}

const SidebarPb: React.FC<SidebarPbProps> = ({ students, onSelect }) => {
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Students</h3>
      <div className="sidebar-list">
        {students.map((student) => (
          <div
            key={student.stud_id}
            className={`sidebar-item ${activeStudentId === student.stud_id ? "active" : ""}`}
            onClick={() => {
              setActiveStudentId(student.stud_id);
              onSelect(student);
            }}
          >
            {student.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarPb;
