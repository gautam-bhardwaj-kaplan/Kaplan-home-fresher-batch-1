import React, { useEffect, useState, useCallback } from "react";
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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditStudent from "../components/editstudent.tsx";
import "./home.css";
import { Snackbar, Alert } from "@mui/material";

interface Student {
  stud_id: number;
  name: string;
  email: string;
  topic?: string;
  hours_studied?: number;
  quiz_score?: number;
  completion_date_topic?: string;
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
  const [openEdit, setOpenEdit] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [openChatbot, setOpenChatbot] = useState(false);
  const handlelogo = () => {
    window.location.href = "/";
  };

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get<StudentApiResponse>(
        "http://localhost:5000/student",
        {
          params: {
            page: page,
            limit: rowsPerPage,
          },
        }
      );
      setStudents(res.data.students);
      setTotalStudents(res.data.total);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const handleSaveStudent = async (updatedStudent: Student) => {
    try {
      type Validator = {
        field: keyof Student;
        validate: (value: any, student: Student) => string | null;
      };

      const validators: Validator[] = [
        {
          field: "name",
          validate: (val) => {
            if (!val?.trim()) return "Name is required.";
            if (!/^[A-Za-z\s]+$/.test(val))
              return "Name to be in valid format.";
            return null;
          },
        },
        {
          field: "email",
          validate: (val) => {
            if (!val?.trim()) return "Email is required.";
            if (!/^\S+@\S+\.\S+$/.test(val)) return "Invalid email format.";
            return null;
          },
        },
        {
          field: "topic",
          validate: (val, student) => {
            const activityFields: (keyof Student)[] = [
              "hours_studied",
              "quiz_score",
              "completion_date_topic",
            ];
            const hasActivityValue = activityFields.some(
              (field) =>
                student[field] !== undefined &&
                student[field] !== null &&
                student[field] !== ""
            );
            return hasActivityValue && !val
              ? "Please select a Topic before saving."
              : null;
          },
        },
        {
          field: "quiz_score",
          validate: (val) =>
            val !== undefined && val > 10
              ? "Quiz Score cannot be more than 10."
              : null,
        },
        {
          field: "hours_studied",
          validate: (val) =>
            val !== undefined && val > 24
              ? "Hours Studied cannot be more than 24."
              : null,
        },
        {
          field: "completion_date_topic",
          validate: (val, student) => {
            const activityFields: (keyof Student)[] = [
              "hours_studied",
              "quiz_score",
            ];
            const hasActivityValue = activityFields.some(
              (field) =>
                student[field] !== undefined &&
                student[field] !== null &&
                student[field] !== ""
            );
            if (!hasActivityValue) return null;
            if (!val) return "Completion date cannot be empty.";
            if (new Date(val) > new Date())
              return "Completion date cannot be in the future.";
            return null;
          },
        },
      ];

      const newErrors: { [key: string]: string } = {};
      validators.forEach(({ field, validate }) => {
        const error = validate(updatedStudent[field], updatedStudent);
        if (error) newErrors[field as string] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setFormMessage({ type: null, text: "" });
      const hasActivity =
        updatedStudent.topic ||
        updatedStudent.hours_studied ||
        updatedStudent.quiz_score ||
        updatedStudent.completion_date_topic;
      if (hasActivity) {
        await axios.post("http://localhost:5000/activity", {
          student_id: updatedStudent.stud_id,
          topic_id: updatedStudent.topic,
          hours_studied: updatedStudent.hours_studied,
          quiz_score: updatedStudent.quiz_score,
          completion_date_topic: updatedStudent.completion_date_topic,
        });
      }

      await axios.put(
        `http://localhost:5000/students/${updatedStudent.stud_id}`,
        {
          name: updatedStudent.name,
          email: updatedStudent.email,
        }
      );

      setFormMessage({ type: "success", text: "Activity Saved Successfully." });

      handleCloseEdit();
      fetchStudents();
    } catch (error) {
      setFormMessage({
        type: "error",
        text: "Please give the correct details.",
      });
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/student/${studentToDelete.stud_id}`
      );

      setFormMessage({
        type: "success",
        text: "Student deleted successfully.",
      });
      fetchStudents();
    } catch (err) {
      setFormMessage({
        type: "error",
        text: "Failed to delete student. Please try again.",
      });
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
    <div className="home">
      <AppBar position="fixed" className="header">
        <Toolbar>
          <img
            src="/kaplan-logo1.svg"
            alt="Kaplan Logo"
            className="logo"
            onClick={handlelogo}
            style={{ cursor: "pointer" }}
          />
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
                onClick={() => {
                  if (label === "Line Chart") navigate("/dashboard");
                  if (label === "Course Progress") navigate("/progress");
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
                    <TableCell
                      colSpan={5}
                      align="center"
                      style={{ padding: "20px" }}
                    >
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
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(student)}
                        >
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

        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          maxWidth="md"
          fullWidth
          className="edit-dialog"
        >
          {currentStudent && (
            <EditStudent
              open={openEdit}
              student={currentStudent}
              onClose={handleCloseEdit}
              onSave={handleSaveStudent}
              errors={errors}
              formMessage={formMessage}
            />
          )}
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          className="delete-dialog"
        >
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

        <Snackbar
          open={!!formMessage.text}
          autoHideDuration={2000}
          onClose={() => setFormMessage({ type: null, text: "" })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setFormMessage({ type: null, text: "" })}
            severity={formMessage.type === "success" ? "success" : "error"}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {formMessage.text}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Home;
