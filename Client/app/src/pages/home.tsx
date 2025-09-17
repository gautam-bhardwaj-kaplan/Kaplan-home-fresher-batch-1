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
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditStudent from "../components/editstudent.tsx";
import "./home.css";

interface Student {
  stud_id: number;
  name: string;
  email: string;
  topic?: string;
  hours_studied?: number;
  quiz_score?: number;
  completion_date_topic?: string;
}

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const fetchStudents = () => {
    axios
      .get<Student[]>("http://localhost:5000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditClick = (student: Student) => {
    setCurrentStudent(student);
    setOpenEdit(true);
    setErrors({}); 
    setFormMessage({ type: null, text: "" });
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCurrentStudent(null);
    setErrors({}); 
    setFormMessage({ type: null, text: "" });
  };


  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error" | null; text: string }>({
    type: null,
    text: ""
  });


  const handleSaveStudent = async (updatedStudent: Student) => {
    
    try {
      const newerrors: {[key: string] : string} = {};
      if (!updatedStudent.topic) {
        newerrors.topic = "Please select a Topic before saving.";
      }

      if (
        updatedStudent.quiz_score !== undefined &&
        updatedStudent.quiz_score > 10
        ) {
        newerrors.quiz_score = "Quiz Score cannot be more than 10.";
        }

      if (
         updatedStudent.hours_studied !== undefined &&
         updatedStudent.hours_studied > 24
        ) {
          newerrors.hours_studied = "Hours Studied cannot be more than 24.";
          }

      if (
         updatedStudent.completion_date_topic &&
         new Date(updatedStudent.completion_date_topic) > new Date()
         ) {
          newerrors.completion_date_topic = "Completion date cannot be in the future.";
          }

      if (Object.keys(newerrors).length > 0) {
      setErrors(newerrors);
      return;
    }

    setErrors({});
    setFormMessage({ type: null, text: "" });    
    console.log("Saving student activity:", updatedStudent);

    await axios.post("http://localhost:5000/activity", {
      student_id: updatedStudent.stud_id,
      topic_id: updatedStudent.topic,
      hours_studied: updatedStudent.hours_studied,
      quiz_score: updatedStudent.quiz_score,
      completion_date_topic: updatedStudent.completion_date_topic,
    });

    await axios.put(`http://localhost:5000/students/${updatedStudent.stud_id}`, {
      email: updatedStudent.email,
    });

    setFormMessage({ type: "success", text: "Activity Saved Successfully." });
    
    setTimeout(() => {
     handleCloseEdit();
    fetchStudents(); 
  }, 1000);
  } catch (error) {
      console.error("Failed to save activity:", error);
      setFormMessage({ type: "error", text: "Please give the correct details." });
  }
};

  const handleDeleteClick = (student: Student) => {
  setStudentToDelete(student);
  setDeleteDialogOpen(true);
};

const handleConfirmDelete = async () => {
  if (!studentToDelete) return;

  try {
    await axios.delete(`http://localhost:5000/student/${studentToDelete.stud_id}`);
    alert("Student deleted successfully");
    fetchStudents(); 
  } catch (err) {
    console.error("Failed to delete student:", err);
    alert("Failed to delete");
  } finally {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  }
};

const handleCancelDelete = () => {
  setDeleteDialogOpen(false);
  setStudentToDelete(null);
};



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
              onClick={() => {
               if (label === "Line Chart") navigate("/dashboard");
               if(label === "Course Progress") navigate("/progress");
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
                    <IconButton 
                    color="primary"
                    onClick={() => handleEditClick(student)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDeleteClick(student)}>
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

      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth className="edit-dialog">
        {currentStudent && (
          <EditStudent
            open = {openEdit}
            student={currentStudent}
            onClose={handleCloseEdit}
            onSave={handleSaveStudent}
            errors={errors} 
            formMessage={formMessage}
          />
        )}
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} className="delete-dialog">
        <Box className="delete-dialog-box">
        <Typography variant="h6" gutterBottom>
          Are you sure you want to delete{" "}
          <strong>{studentToDelete?.name}</strong>?
        </Typography>
        <Box className="delete-dialog-actions">
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirmDelete}
        >
         Yes
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancelDelete}
        >
         No
        </Button>
        </Box>
        </Box>
      </Dialog>


    </div>
  );
};

export default Home;
