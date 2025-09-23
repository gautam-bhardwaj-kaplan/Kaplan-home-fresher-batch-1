import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./HeaderPb.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EnrollmentChartDialog from "./EnrollmentChartDialog.tsx";

const HeaderPb = () => {
  const navigate = useNavigate();
  const handlelogo = () => {
    navigate("/");
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <AppBar position="fixed" className="header-appbar">
        <Toolbar className="header-toolbar">
          <img
            src="/kaplan-logo1.svg"
            alt="Kaplan Logo"
            className="header-logo"
            onClick={handlelogo}
            style={{ cursor: "pointer" }}
          />
          <Box className="header-title-container">
            <Typography variant="h5" className="header-title">
              Course Progress
            </Typography>
          </Box>
          <Box className="header-btn-container">
            <Button
              variant="outlined"
              className="header-enrollment-btn"
              onClick={() => setOpenDialog(true)}
            >
              {isMobile ? "EC" : "Enrollment Chart"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <EnrollmentChartDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
};

export default HeaderPb;
