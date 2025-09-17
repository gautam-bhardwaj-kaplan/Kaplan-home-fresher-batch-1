import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";  
import "./styling/editstudent.css";

interface Student {
  stud_id: number;
  name: string;
  email: string;
  course?: string;
  topic?: string;
  hours_studied?: number;
  quiz_score?: number;
  completion_date_topic?: string;
}

interface Course {
  course_id: string;
  course_name: string;
}

interface Topic {
  topic_id: string;
  topic_name: string;
}

interface EditStudentProps {
  open: boolean; 
  onClose: () => void;
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
  errors: { [key: string]: string }; 
  formMessage: { type: "success" | "error" | null; text: string };
}

const EditStudent: React.FC<EditStudentProps> = ({
  open,
  onClose,
  student,
  onSave,
  errors,
  formMessage,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState<Student | null>(student);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  useEffect(() => {
    axios
      .get<Course[]>("http://localhost:5000/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (formData?.course) {
      axios
        .get<Topic[]>(`http://localhost:5000/topics/${formData.course}`)
        .then((res) => setTopics(res.data))
        .catch((err) => console.error(err));
    } else {
      setTopics([]);
    }
  }, [formData?.course]);

useEffect(() => {
  if (formData?.topic && student?.stud_id) {
    axios
      .get<{
        hours_studied: number; 
        quiz_score: number; 
        completion_date_topic: string }>(
        `http://localhost:5000/activity/${student.stud_id}/${formData.topic}`
      )
      .then((res) => {
        const data = res.data;
        setFormData((prev) => ({
          ...prev!,
          hours_studied: data.hours_studied ?? "",
          quiz_score: data.quiz_score ?? "",
          completion_date_topic: data.completion_date_topic
            ? data.completion_date_topic.split("T")[0] 
            : "",
        }));
      })
      .catch((err) => console.error(err));
  } else {
    
    setFormData((prev) => ({
      ...prev!,
      hours_studied: undefined,
      quiz_score: undefined,
      completion_date_topic: "",
    }));
  }
}, [formData?.topic, student]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
) => {
  const { name, value } = e.target;

  setFormData((prev) =>
    prev
      ? {
          ...prev,
          [name]: name === "hours_studied" || name === "quiz_score"
            ? value === "" ? "" : parseFloat(value) 
            : value,
        }
      : prev
  );
};

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };


  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      classes={{ paper: "custom-dialog" }}>
      
      <DialogTitle className="custom-dialog-title">Edit Student</DialogTitle>
      <DialogContent dividers>
        
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={formData?.email || ""}
          onChange={handleChange}
          fullWidth
        />

        {/*  Course dropdown */}
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Course</InputLabel>
          <Select
            label = "Course"
            name="course"
            value={formData?.course || ""}
            onChange={handleChange}
          >
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.course_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/*  Topic dropdown */}
        <FormControl fullWidth margin="dense" variant="outlined" disabled={!formData?.course}>
          <InputLabel>Topic</InputLabel>
          <Select
            label = "Topic"
            name="topic"
            value={formData?.topic || ""}
            onChange={handleChange}
          >
            {topics.map((topic) => (
              <MenuItem key={topic.topic_id} value={topic.topic_id}>
                {topic.topic_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          margin="dense"
          label="Hours Studied"
          name="hours_studied"
          type="number"
          value={formData?.hours_studied || ""}
          onChange={handleChange}
          fullWidth
          inputProps={{ step: "0.1", min: 0, max: 24 }}
          disabled={!formData?.topic}
          error={!!errors.hours_studied}
          helperText={errors.hours_studied}
        />

        <TextField
          margin="dense"
          label="Quiz Score"
          name="quiz_score"
          type="number"
          value={formData?.quiz_score || ""}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0, max: 10 }} 
          disabled={!formData?.topic}
          error={!!errors.quiz_score}
          helperText={errors.quiz_score}
        />

        <TextField
          margin="dense"
          label="Completion Date"
          name="completion_date_topic"
          type="date"
          value={formData?.completion_date_topic || ""}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{
            max: new Date().toISOString().split("T")[0], 
           }}
          disabled={!formData?.topic} 
          error={!!errors.completion_date_topic}
          helperText={errors.completion_date_topic}
        />
        {formMessage.text && (
        <p style={{ color: formMessage.type === "error" ? "red" : "green" }}>
          {formMessage.text}
        </p>
      )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;
