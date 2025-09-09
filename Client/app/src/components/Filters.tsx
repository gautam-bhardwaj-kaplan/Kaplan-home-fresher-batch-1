import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface FiltersProps {
  selectedCourse: string | null;
  setSelectedCourse: (course: string | null) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
  timeframe: "daily" | "weekly";
  setTimeframe: (timeframe: "daily" | "weekly") => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCourse,
  setSelectedCourse,
  selectedTopic,
  setSelectedTopic,
  timeframe,
  setTimeframe,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Course Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Course</InputLabel>
        <Select
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(e.target.value || null)}
        >
          <MenuItem value="">All Courses</MenuItem>
          <MenuItem value="course1">Course 1</MenuItem>
          <MenuItem value="course2">Course 2</MenuItem>
        </Select>
      </FormControl>

      {/* Topic Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Topic</InputLabel>
        <Select
          value={selectedTopic || ""}
          onChange={(e) => setSelectedTopic(e.target.value || null)}
        >
          <MenuItem value="">All Topics</MenuItem>
          <MenuItem value="topic1">Topic 1</MenuItem>
          <MenuItem value="topic2">Topic 2</MenuItem>
        </Select>
      </FormControl>

      {/* Timeframe Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Timeframe</InputLabel>
        <Select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as "daily" | "weekly")}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;
