import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./HeaderPb.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EnrollmentChartDialog from "./EnrollmentChartDialog.tsx";

interface headerProps {
  title: string;
  showEnrollment?: boolean;
}

const HeaderPb: React.FC<headerProps> = ({ title, showEnrollment = false }) => {
  const navigate = useNavigate();
  const handlelogo = () => {
    navigate("/");
  };
  const [openDialog, setOpenDialog] = useState(false);
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
              {title}
            </Typography>
          </Box>
          {showEnrollment && (
            <Box className="header-btn-container">
              <Button
                variant="outlined"
                className="header-enrollment-btn"
                onClick={() => setOpenDialog(true)}
              >
                Enrollment Chart
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {showEnrollment && (
        <EnrollmentChartDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default HeaderPb;
