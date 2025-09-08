import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface Student {
  stud_id: number;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    axios.get<Student[]>("http://localhost:5000/student")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
 <div>
      {/* Header */}
      <AppBar position="static" sx={{ background: "linear-gradient(to right, #4a90e2, #357ABD)" }}>
        <Toolbar>
          <img
            src="/kaplan-logo.svg"
            alt="Kaplan Logo"
            style={{ width: 50, marginRight: 16 }}
          />

          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "#fff"
            }}
          >
            Student Progress Tracker
          </Typography>

          <Button color="inherit" sx={{ fontWeight: "bold" }}>Login</Button>
        </Toolbar>
      </AppBar>

        {/* Stylish Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
            {["Line Chart", "Bar Chart", "Course Progress", "Add Student"].map((label) => (
            <Button
            key={label}
            sx={{
                background: "linear-gradient(to right, #4a90e2, #357ABD)", // header matching gradient
                color: "#fff",
                fontWeight: 600,
                borderRadius: 2,
                paddingX: 3,
                paddingY: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                background: "#fff",
                color: "#357ABD",
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                },
                }}
            >
                {label}
                </Button>
            ))}
        </Box>



     {/* Styled Student Table */}
      <Box sx={{ mt: 4, mx: "auto", maxWidth: 900, borderRadius: 3, p: 2, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: "center", color: "#333" }}>
            Students List
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                <TableHead sx={{ backgroundColor: "#4a90e2" }}>
                <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600, textAlign: "center" }}>Edit</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600, textAlign: "center" }}>Delete</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {students.map(student => (
                    <TableRow
                    key={student.stud_id}
                    sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f0f4f8" },
                        "&:hover": { backgroundColor: "#e1eaff", cursor: "pointer" },
                    }}
                    >
                    <TableCell>{student.stud_id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                        <IconButton color="primary">
                        <EditIcon />
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                        <IconButton color="error">
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
                </Table>
            </TableContainer>
      </Box>
    </div>
  );
};

export default Home;
