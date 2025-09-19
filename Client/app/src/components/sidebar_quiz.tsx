import React, { useEffect, useState } from "react";
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
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonIcon from "@mui/icons-material/Person";
import "../components/styles/sidebar_quiz.css";
import { Student } from "../types.ts";

const API_BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';

const Sidebar: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/students?page=${page - 1}&rowsPerPage=${rowsPerPage}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let msg = `Failed to fetch students (status ${res.status})`;
          try {
            const parsed = JSON.parse(text);
            msg = parsed.message || msg;
          } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        if (cancelled) return;
        setStudents(data.rows || []);
        setTotal(data.total || (data.rows ? data.rows.length : 0));
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error fetching students:", err);
          setError(err.message || "Could not load students.");
        }
      }
    };

    fetchStudents();
    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage]);

  return (
    <Box className={`sidebar ${open ? "open" : "closed"}`}>
      <Box className="sidebar-header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
        {open && <Typography variant="h6" className="sidebar-title">Students</Typography>}
        <IconButton onClick={() => setOpen(!open)} className="menu-btn">
          {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </IconButton>
      </Box>

      {open && (
        <>
          {error && <Typography color="error" sx={{ px: 2 }}>{error}</Typography>}

          <List className="sidebar-list">
            {students.map((student) => {
              const studentPath = `/quiz/${student.id}`; 
              const isCurrent = location.pathname === studentPath;

              return (
                <ListItem key={student.id} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={studentPath}
                    className={`sidebar-item ${isCurrent ? "active" : ""}`}
                  >
                    <PersonIcon className="student-icon" />
                    <ListItemText primary={student.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box className="pagination-container" sx={{ px: 2, py: 1 }}>
            <Pagination
              count={Math.max(1, Math.ceil(total / rowsPerPage))}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sidebar;
