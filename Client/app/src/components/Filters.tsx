import React, {useState,useEffect} from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  Button
} from "@mui/material";
import "./styling/filters.css";

interface FiltersProps {
  courses: string[];
  topics: string[];
  selectedCourse: string | null;
  setSelectedCourse: (course: string | null) => void;
  selectedTopic: string[];
  setSelectedTopic: (topic: string[]) => void;
  timeframe: "daily" | "weekly";
  setTimeframe: (timeframe: "daily" | "weekly") => void;
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

  const [tempSelected, setTempSelected] = useState<string[]>(selectedTopic);

  useEffect(() => {
  setTempSelected([]);
  setSelectedTopic([]);
}, [selectedCourse]);

  const handleTempChange = (event: any) => {
    const value = event.target.value as string[];
    setTempSelected(value);
  };

  const handleApply = () => {
    setSelectedTopic(tempSelected);
  };

  const handleCancel = () => {
    setTempSelected(selectedTopic); 
  };

  return (
    <Box className="filters-container">
      <FormControl
        className="filters-formcontrol"
        variant="outlined"
        fullWidth
        margin="dense"
      >
        <InputLabel>Course</InputLabel>
        <Select
    value={selectedCourse === null ? "All Courses" : selectedCourse}
    label="Course"
    onChange={(e) => {
      const valStr = e.target.value;
      const val = valStr === "All Courses" ? null : valStr;
      setSelectedCourse(val);
    }}
        >
          <MenuItem value="All Courses">
            All Courses
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Topic Filter */}
  <FormControl
    className="filters-formcontrol"
    variant="outlined"
    fullWidth
    margin="dense"
    disabled={!selectedCourse} 
  >
    <InputLabel>Topic</InputLabel>
    <Select
      multiple
      label="Topic"
      value={tempSelected}
      onChange={(e) => {
      const value = e.target.value as string[];
      setTempSelected(value);
    }}
    renderValue={(selected) =>
      selected.length === 0 ? "All Topics" : selected.join(", ")
    }
    >
      {topics.map((topic) => (
        <MenuItem key={topic} value={topic}>
          <Checkbox checked={tempSelected.includes(topic)} />
          <ListItemText primary={topic} />
        </MenuItem>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Button size="small" onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button size="small" onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
      </Box>
    </Select>
  </FormControl>

      {/* Timeframe Filter */}
      <FormControl className="filters-formcontrol" variant="outlined" fullWidth margin="dense">
        <InputLabel>Timeframe</InputLabel>
        <Select
        label = "Timeframe"
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
