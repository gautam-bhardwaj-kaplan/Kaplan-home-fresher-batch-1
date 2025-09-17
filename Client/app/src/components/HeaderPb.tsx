import { AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import "./HeaderPb.css";


const HeaderPb = () => {
  const navigate = useNavigate();

  const handlelogo = () =>{
    navigate("/");
  };
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
