import { AppBar, Toolbar, Typography } from "@mui/material";
import "./HeaderPb.css";

const HeaderPb = () => {
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar>
        <img
          src="/kaplan-logo1.svg"
          alt="Kaplan Logo"
          className="header-logo"
        />
        <Typography variant="h5" className="header-title">
          Course Progress
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderPb;
