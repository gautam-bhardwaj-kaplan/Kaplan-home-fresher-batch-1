import { AppBar, Toolbar, Typography } from "@mui/material";
import "./styling/header.css"; // import the CSS file

const Header = () => {
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar className="header-toolbar">
        <img
          src="/kaplan-logo1.svg"
          alt="Kaplan Logo"
          className="header-logo"
        />
        <Typography variant="h5" className="header-title">
          Line Chart
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
