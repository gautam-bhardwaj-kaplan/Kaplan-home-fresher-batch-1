import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  IconButton,
  Pagination,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Student } from "../types.ts";
import React, { useState, useEffect } from "react";
import "../components/styles/sidebar_quiz.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const Sidebar: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation();

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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch students");
        }
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError(err.message || "Could not load students.");
      }
    };
    fetchStudents();
  }, []);

  return (
    <Box className={`sidebar ${open ? "open" : "closed"}`}>
     
      <Box className="sidebar-header">
        {open && (
          <Typography variant="h6" className="sidebar-title">
            Students
          </Typography>
        )}
        <IconButton onClick={() => setOpen(!open)} className="menu-btn">
          <MenuRoundedIcon />
        </IconButton>
      </Box>

      
      {open && (
        <>
          {error && <Typography color="error">{error}</Typography>}

          <List className="sidebar-list">
            {students.map((student, index) => {
              const studentPath = `/quiz/${student.id}`;
              const isCurrent = location.pathname === studentPath;
              const noActiveMatch = !students.some(
                (s) => location.pathname === `/quiz/${s.id}`
              );
              const active = isCurrent || (index === 0 && noActiveMatch);

              return (
                <ListItem key={student.id} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/quiz/${student.id}`}
                    className={`sidebar-item ${active ? "active" : ""}`}
                  >
                    <ListItemText primary={student.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </>
        
      )}
    </Box>
  );
};

export default Sidebar;
