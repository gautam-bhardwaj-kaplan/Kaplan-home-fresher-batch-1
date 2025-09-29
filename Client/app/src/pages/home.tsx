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
  InputAdornment,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import ArchiveIcon from "@mui/icons-material/Archive";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditStudent from "../components/editstudent.tsx";
import "./home.css";
import { Snackbar, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StudentDialog from "../components/create.tsx";
import { useMediaQuery } from "@mui/material";

interface Student {
  stud_id: number;
  name: string;
  email: string;
  topic?: string;
  hours_studied?: number;
  quiz_score?: number;
  completion_date_topic?: string;
  archived_at?: string;
}
interface StudentApiResponse {
  students: Student[];
  total: number;
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [archivedStudents, setArchivedStudents] = useState<Student[]>([]);
  const [archivedDialogOpen, setArchivedDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handlelogo = () => {
    window.location.href = "/";
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<StudentApiResponse>(
        "http://localhost:5000/student/home",
        {
          params: {
            page: page,
            limit: rowsPerPage,
            search: searchQuery || undefined,
          },
        }
      );
      setStudents(res.data.students);
      setTotalStudents(res.data.total);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  const fetchArchivedStudents = async () => {
    try {
      const res = await axios.get<Student[]>(
        "http://localhost:5000/archived-students"
      );
      setArchivedStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch archived students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, searchQuery]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3 || value.length === 0) {
      setSearchQuery(value);
      setPage(0);
    }
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
      await axios.put(
        `http://localhost:5000/students/${updatedStudent.stud_id}`,
        {
          name: updatedStudent.name,
          email: updatedStudent.email,
        }
      );
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
      setFormMessage({
        type: "success",
        text: "Student updated successfully.",
      });
      setErrors({});
      handleCloseEdit();
      fetchStudents();
    } catch (error) {
      setFormMessage({
        type: "error",
        text: "Failed to update student. Please check details.",
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

  const handleOpenArchivedDialog = () => {
    fetchArchivedStudents();
    setArchivedDialogOpen(true);
  };
  const handleCloseArchivedDialog = () => {
    setArchivedDialogOpen(false);
  };
  const handleRestoreStudent = async (stud_id: number) => {
    try {
      await axios.post(`http://localhost:5000/restore-student/${stud_id}`);
      fetchStudents();
      fetchArchivedStudents();
      setFormMessage({
        type: "success",
        text: "Student restored successfully.",
      });
      setArchivedDialogOpen(false);
    } catch (err) {
      setFormMessage({
        type: "error",
        text: "Failed to restore student.",
      });
    }
  };

  const isMobile = useMediaQuery("(max-width:768px)");

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
                  if (label === "Bar Chart") navigate("/quiz/:studentId?");
                  if (label === "Add Student") setDialogOpen(true);
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
          <Box className="student-table-header">
            <Typography variant="h6" className="student-table-title">
              Students List
            </Typography>
            <IconButton
              onClick={handleOpenArchivedDialog}
              title="Recycle Bin"
              className="recycle-bin-icon"
            >
              <ArchiveIcon style={{ color: "black" }} />
            </IconButton>
            <TextField
              type="text"
              className="student-search-input"
              placeholder="Search by ID, Name or Email..."
              value={searchInput}
              onChange={handleSearchInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="loader-container">
                        <CircularProgress />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="no-users">
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
          open={archivedDialogOpen}
          onClose={() => setArchivedDialogOpen(false)}
          maxWidth="md"
          fullWidth
          className="archived-dialog"
        >
          <Box className="title-with-icon-arch">
            <Typography variant="h6" className="student-table-title-arch">
              Archived Students
            </Typography>
            <IconButton
              onClick={handleCloseArchivedDialog}
              className="close-icon"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="student-table-head">
                <TableRow>
                  <TableCell className="table-header">ID</TableCell>
                  <TableCell className="table-header">Name</TableCell>
                  <TableCell className="table-header">Email</TableCell>
                  <TableCell className="table-header">Archived On</TableCell>
                  <TableCell className="table-header" align="center">
                    Restore
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {archivedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No archived students
                    </TableCell>
                  </TableRow>
                ) : (
                  archivedStudents.map((student) => (
                    <TableRow key={student.stud_id} className="student-row">
                      <TableCell>{student.stud_id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.archived_at
                          ? new Date(student.archived_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="success"
                          onClick={() => handleRestoreStudent(student.stud_id)}
                          className="restore-icon"
                        >
                          <RestoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>

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

        {formMessage.text && formMessage.type && (
          <Snackbar
            open={true}
            autoHideDuration={2000}
            onClose={() => setFormMessage({ type: null, text: "" })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setFormMessage({ type: null, text: "" })}
              severity={formMessage.type}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {formMessage.text}
            </Alert>
          </Snackbar>
        )}
      </div>
      <StudentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStudentAdded={fetchStudents}
      />
    </div>
  );
};

export default Home;
