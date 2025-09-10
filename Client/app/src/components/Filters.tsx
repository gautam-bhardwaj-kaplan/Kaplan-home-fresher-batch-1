import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface FiltersProps {
  courses: string[];
  topics: string[];
  selectedCourse: string | null;
  setSelectedCourse: (course: string | null) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
  timeframe: "daily" | "weekly";
  setTimeframe: (tf: "daily" | "weekly") => void;
}

const Filters: React.FC<FiltersProps> = ({
  courses,
  topics,
  selectedCourse,
  setSelectedCourse,
  selectedTopic,
  setSelectedTopic,
  timeframe,
  setTimeframe,
}) => {
  return (
    <Box display="flex" gap={2} mb={2}>
      {/* Course Filter */}
      <FormControl fullWidth>
        <InputLabel>Course</InputLabel>
        <Select
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(e.target.value || null)}
        >
          <MenuItem value="">All Courses</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Topic Filter */}
      <FormControl fullWidth>
        <InputLabel>Topic</InputLabel>
        <Select
          value={selectedTopic || ""}
          onChange={(e) => setSelectedTopic(e.target.value || null)}
        >
          <MenuItem value="">All Topics</MenuItem>
          {topics.map((topic) => (
            <MenuItem key={topic} value={topic}>
              {topic}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Timeframe Filter */}
      <FormControl fullWidth>
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
