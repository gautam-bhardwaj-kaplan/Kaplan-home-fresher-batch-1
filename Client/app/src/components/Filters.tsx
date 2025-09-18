import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  Button,
} from "@mui/material";
import "./styling/filters.css";

interface Course {
  course_id: string;
  course_name: string;
}

interface Topic {
  topic_id: string;
  topic_name: string;
}

interface FiltersProps {
  courses: Course[];
  topics: Topic[];
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
  const [topicOpen, setTopicOpen] = useState(false);

  useEffect(() => {
    setTempSelected([]);
    setSelectedTopic([]);
  }, [selectedCourse, setSelectedTopic]);

  const handleApply = () => {
    setSelectedTopic(tempSelected);
    setTopicOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedTopic);
    setTopicOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCourse(null);
    setSelectedTopic([]);
    setTimeframe("daily");
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
          <MenuItem value="All Courses">All Courses</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.course_id} value={course.course_id}>
              {course.course_name}
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
          open={topicOpen}
          onOpen={() => setTopicOpen(true)}
          onClose={() => setTopicOpen(false)}
          onChange={(e) => setTempSelected(e.target.value as string[])}
          renderValue={(selected) =>
            selected.length === 0
              ? "All Topics"
              : topics
                  .filter((t) => selected.includes(t.topic_id))
                  .map((t) => t.topic_name)
                  .join(", ")
          }
        >
          {topics.map((topic) => (
            <MenuItem key={topic.topic_id} value={topic.topic_id}>
              <Checkbox checked={tempSelected.includes(topic.topic_id)} />
              <ListItemText primary={topic.topic_name} />
            </MenuItem>
          ))}

          <Box className="filters-actions">
            <Button size="small" onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button
              size="small"
              onClick={handleApply}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </Box>
        </Select>
      </FormControl>

      {/* Timeframe Filter */}
      <FormControl
        className="filters-formcontrol"
        variant="outlined"
        fullWidth
        margin="dense"
      >
        <InputLabel>Timeframe</InputLabel>
        <Select
          label="Timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as "daily" | "weekly")}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="text"
        size="small"
        onClick={handleClearFilters}
        className="clear-filters-btn"
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default Filters;
