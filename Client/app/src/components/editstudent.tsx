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
  errors?: { [key: string]: string };
  formMessage: { type: "success" | "error" | null; text: string };
}
const EditStudent: React.FC<EditStudentProps> = ({
  open,
  onClose,
  student,
  onSave,
  formMessage,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState<Student | null>(student);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    if (!formData?.course) {
      setTopics([]);
      clearActivityFields();
      return;
    }
    axios
      .get<Topic[]>(`http://localhost:5000/topics/${formData.course}`)
      .then((res) => setTopics(res.data))
      .catch(console.error);
    updateFormData({ topic: "" });
    clearActivityFields();
  }, [formData?.course]);
  useEffect(() => {
    if (!formData?.topic || !student?.stud_id) {
      clearActivityFields();
      return;
    }
    axios
      .get<{
        hours_studied: number;
        quiz_score: number;
        completion_date_topic: string;
      }>(`http://localhost:5000/activity/${student.stud_id}/${formData.topic}`)
      .then((res) => {
        const { hours_studied, quiz_score, completion_date_topic } = res.data;
        updateFormData({
          hours_studied: hours_studied ?? undefined,
          quiz_score: quiz_score ?? undefined,
          completion_date_topic: completion_date_topic
            ? completion_date_topic.split("T")[0]
            : "",
        });
        setErrors({
          hours_studied:
            hours_studied === undefined || hours_studied === null
              ? "Hours is required."
              : "",
          quiz_score:
            quiz_score === undefined || quiz_score === null
              ? "Score is required."
              : "",
          completion_date_topic: completion_date_topic
            ? ""
            : "Date can't be empty",
        });
      })
      .catch(() => {
        updateFormData({
          hours_studied: undefined,
          quiz_score: undefined,
          completion_date_topic: "",
        });
        setErrors({
          hours_studied: "Hours is required.",
          quiz_score: "Score is required.",
          completion_date_topic: "Date can't be empty",
        });
      });
  }, [formData?.topic, student]);
  const updateFormData = (updates: Partial<Student>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : prev));
  };
  const clearActivityFields = () => {
    updateFormData({
      hours_studied: undefined,
      quiz_score: undefined,
      completion_date_topic: "",
    });
    setErrors({
      hours_studied: "",
      quiz_score: "",
      completion_date_topic: "",
    });
  };
  const validateField = (name: string, value: any) => {
    if (
      !formData?.topic &&
      ["hours_studied", "quiz_score", "completion_date_topic"].includes(name)
    ) {
      return "";
    }
    switch (name) {
      case "name":
        if (!value?.trim()) return "Name is required.";
        if (!/^[A-Za-z ]+$/.test(value))
          return "Name must only contain letters.";
        return "";
      case "email":
        if (!value?.trim()) return "Email is required.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
          return "Invalid email format.";
        }
        return "";
      case "hours_studied":
        if (value === null || value === undefined) return "Hours is required";
        if (value < 0 || value > 24) return "Hours must be between 0–24.";
        return "";
      case "quiz_score":
        if (value === null || value === undefined)
          return "Quiz score is required";
        if (value < 0 || value > 10) return "Score must be between 0–10.";
        return "";
      case "completion_date_topic":
        if (!value) return "Date can't be empty";
        if (new Date(value) > new Date())
          return "Date cannot be in the future.";
        return "";
      default:
        return "";
    }
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    const numericFields = ["hours_studied", "quiz_score"];
    const parsedValue = numericFields.includes(name)
      ? value === ""
        ? undefined
        : parseFloat(value)
      : value;
    updateFormData({ [name]: parsedValue } as Partial<Student>);
    const error = validateField(name, parsedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleSave = () => {
    if (!formData) return;
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, (formData as any)[key]);
      if (err) newErrors[key] = err;
    });
    if (formData.topic) {
      if (
        formData.hours_studied === undefined ||
        formData.hours_studied === null
      ) {
        newErrors.hours_studied = "Hours is required";
      }
      if (formData.quiz_score === undefined || formData.quiz_score === null) {
        newErrors.quiz_score = "Score is required";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      classes={{ paper: "custom-dialog" }}
    >
      <DialogTitle className="custom-dialog-title">Edit Student</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          value={formData?.name || ""}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={formData?.email || ""}
          onChange={handleChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />
        {/*  Course dropdown */}
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Course</InputLabel>
          <Select
            label="Course"
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
        <FormControl
          fullWidth
          margin="dense"
          variant="outlined"
          disabled={!formData?.course}
        >
          <InputLabel>Topic</InputLabel>
          <Select
            label="Topic"
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
          placeholder="Upto 24hrs"
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
          placeholder="Upto 10"
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
