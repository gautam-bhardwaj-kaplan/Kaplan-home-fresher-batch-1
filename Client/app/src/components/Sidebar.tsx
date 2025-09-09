import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student"); // backend API
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

  return (
    <div
      style={{
        width: "250px",
        padding: "16px",
        borderRight: "1px solid #ccc",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Students
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <List>
          {students.map((student) => (
            <ListItem key={student.stud_id} disablePadding>
              <ListItemButton onClick={() => onStudentSelect(student.stud_id)}>
                <ListItemText primary={student.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Sidebar;
