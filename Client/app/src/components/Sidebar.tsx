import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import "./styling/sidebar.css";

interface Student {
  stud_id: string;
  name: string;
}

interface SidebarProps {
  onStudentSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onStudentSelect }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student");
        setStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
        setError("Could not load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedStudent(id);
    onStudentSelect(id);
  };

  return (
    <div className="sidebar-container">
      <Typography className="sidebar-heading">Students</Typography>

      {loading && <CircularProgress sx={{ m: 2 }} />}
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <List className="student-list">
          {students.map((student) => (
            <ListItem
              key={student.stud_id}
              onClick={() => handleSelect(student.stud_id)}
              className={`student-item ${selectedStudent === student.stud_id ? "selected" : ""}`}
            >
              <ListItemText primary={student.name} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Sidebar;
