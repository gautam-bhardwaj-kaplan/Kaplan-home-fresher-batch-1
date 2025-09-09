import { AppBar, Toolbar, Typography } from "@mui/material";
const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(to right, #0033A0, #0033A0)" }}
    >
      <Toolbar>
        <img
          src="/kaplan-logo1.svg"
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
            color: "#fff",
          }}
        >
          Line Chart
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Header;