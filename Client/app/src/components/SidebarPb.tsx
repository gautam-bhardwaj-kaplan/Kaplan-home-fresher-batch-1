import React, { useState, useEffect } from "react";
import axios from "axios";
import axios from "axios";
import "./SidebarPb.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonIcon from "@mui/icons-material/Person";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Student {
  stud_id: number;
  name: string;
}

interface SidebarResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SidebarResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SidebarPbProps {
  onSelect: (student: Student) => void;
  selectedStudent: Student | null;
  pageSize?: number;
  onToggle?: (isOpen: boolean) => void;
  pageSize?: number;
  onToggle?: (isOpen: boolean) => void;
}

const SidebarPb: React.FC<SidebarPbProps> = ({
  onSelect,
  selectedStudent,
  pageSize = 10,
  onToggle,
  pageSize = 10,
  onToggle,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpen(false);
        onToggle?.(false);
        onToggle?.(false);
      } else {
        setOpen(true);
        onToggle?.(true);
        onToggle?.(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onToggle]);

  const totalPages = Math.ceil(totalStudents / pageSize);

  const fetchStudents = async (page: number) => {
    try {
      const res = await axios.get<SidebarResponse>(
        `http://localhost:5000/student/sidebar/all?page=${page}&limit=${pageSize}`
      );
      setStudents(res.data.students);
      setTotalStudents(res.data.total);

      
      if (res.data.students.length > 0) {
        onSelect(res.data.students[0]);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

 
  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);


  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onToggle?.(newState);
  };


  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {open && <h3 className="sidebar-title">Students</h3>}

        <div className="menu-btn" onClick={handleToggle}>
        <div className="menu-btn" onClick={handleToggle}>
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
      {open && totalPages > 1 && (
        <div className="sidebar-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &lt;&lt;
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &gt;&gt;
          </button>
        </div>
      )}
      {open && totalPages > 1 && (
        <div className="sidebar-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &lt;&lt;
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};
export default SidebarPb;