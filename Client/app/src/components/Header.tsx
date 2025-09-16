import { AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import "./styling/header.css"; 

const Header = () => {
  const navigate = useNavigate();
  
    const handlelogo = () =>{
      navigate("/");
    };
  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar className="header-toolbar">
        <img
          src="/kaplan-logo1.svg"
          alt="Kaplan Logo"
          className="header-logo"
          onClick={handlelogo}
          style={{ cursor: "pointer" }}
        />
        <Typography variant="h5" className="header-title">Line Chart</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
