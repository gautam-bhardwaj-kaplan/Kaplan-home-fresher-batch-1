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
  TablePagination,
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
interface StudentApiResponse {
  students: Student[];
  total: number;
}

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const handlelogo=() =>{
   window.location.href = "/";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get<StudentApiResponse>("http://localhost:5000/student", {
          params: {
            page: page, 
            limit: rowsPerPage,
          },
        });
        setStudents(res.data.students);
        setTotalStudents(res.data.total);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [page, rowsPerPage]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <div className="home">
      <AppBar position="fixed" className="header">
        <Toolbar>
          <img src="/kaplan-logo1.svg" 
           alt="Kaplan Logo" 
           className="logo" 
           onClick={handlelogo}
           style={{cursor:"pointer"}} />
          <Typography variant="h5" className="header-title">
            Student Progress Tracker
          </Typography>
          <Button color="inherit" className="login-btn">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <div className="main-content">

      <Box className="button-container">
        {["Line Chart", "Bar Chart", "Course Progress", "Add Student"].map(
          (label) => (
            <Button
              key={label}
              onClick={() => label === "Course Progress" && navigate("/progress")}
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
        
        <TableContainer component={Paper}  className="student-table-paper" >
          <Table >
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
        <TablePagination
          component="div"
          count={totalStudents} 
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>
      </div>
    </div>
  );
};

export default Home;
