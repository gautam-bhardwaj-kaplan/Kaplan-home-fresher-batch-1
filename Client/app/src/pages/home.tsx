import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home.css";

interface Student {
  stud_id: number;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:5000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <AppBar position="static" className="header">
        <Toolbar>
          <img src="/kaplan-logo1.svg" alt="Kaplan Logo" className="logo" />
          <Typography variant="h5" className="header-title">
            Student Progress Tracker
          </Typography>
          <Button color="inherit" className="login-btn">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box className="button-container">
        {["Line Chart", "Bar Chart", "Course Progress", "Add Student"].map(
          (label) => (
            <Button
              key={label}
              onClick={() =>{

             if (label === "Course Progress") navigate("/progress");
             if (label === "Bar Chart") navigate("/quiz/:studentId?");
            }}
              className="styled-button"
            >
              {label}
            </Button>
          )
        )}
      </Box>

      <Box className="student-table-container">
        <Typography variant="h6" className="student-table-title">
          Students List
        </Typography>
        <TableContainer component={Paper} className="student-table-paper">
          <Table>
            <TableHead className="student-table-head">
              <TableRow>
                <TableCell className="table-header">ID</TableCell>
                <TableCell className="table-header">Name</TableCell>
                <TableCell className="table-header">Email</TableCell>
                <TableCell className="table-header" align="center">
                  Edit
                </TableCell>
                <TableCell className="table-header" align="center">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: "20px" }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
              students.map((student) => (
                <TableRow key={student.stud_id} className="student-row">
                  <TableCell>{student.stud_id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Home;
