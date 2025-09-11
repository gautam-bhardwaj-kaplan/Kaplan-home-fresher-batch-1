// src/components/sidebar_quiz.tsx

import { Drawer, Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Student } from "../types.ts";
import React, { useState, useEffect } from "react";
import '../components/styles/sidebar_quiz.css';

const Sidebar: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");

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
    <Drawer
      variant="permanent"
      className="sidebar-drawer" 
    >
      
      <Typography
        variant="h6"
        className="sidebar-title" 
      >
        STUDENTS
      </Typography>

      <Box className="sidebar-list-container"> 
        {error && <Typography color="error" className="sidebar-error">{error}</Typography>}
        <List>
          {students.map((student) => (
            <ListItem key={student.id} disablePadding>
              <ListItemButton component={Link} to={`/quiz/${student.id}`}>
                <ListItemText primary={student.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
