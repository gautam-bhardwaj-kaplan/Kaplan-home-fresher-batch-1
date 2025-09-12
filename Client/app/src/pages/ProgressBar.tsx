import React from "react";
import HeaderPb from "../components/HeaderPb.tsx";
import { Box, Typography } from "@mui/material";

const ProgressBar = () => {
  return (
    <>
      <HeaderPb />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Progress Bar Page
        </Typography>
        <Typography>
          Here you can display progress tracking features, charts, or bars.
        </Typography>
      </Box>
    </>
  );
};

export default ProgressBar;
