import { AppBar, Toolbar, Typography } from "@mui/material";
import "./HeaderPb.css";
import { useNavigate } from "react-router-dom";

const HeaderPb = () => {
  const navigate=useNavigate();
  const handlelogo=() =>{
    navigate("/");
  };
  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar>
        <img
          src="/kaplan-logo1.svg"
          alt="Kaplan Logo"
          className="header-logo"
          onClick={handlelogo}
          style={{cursor:"pointer"}}
        />
        <Typography variant="h5" className="header-title">
          Course Progress
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderPb;
