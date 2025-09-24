import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";
import "../components/styles/create.css";
import { Course, Topic, TopicSelection, Props } from "../types.ts";

const StudentDialog: React.FC<Props> = ({ open, onClose, onStudentAdded }) => {
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<TopicSelection[]>([]);
  const [errors, setErrors] = useState<Record<number, Partial<Record<"quiz_score" | "hours_studied" | "completion_date", string>>>>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [studentNameError, setStudentNameError] = useState<string | null>(null);
  useEffect(() => {
    fetch("http://localhost:5000/create/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    if (course) {
      fetch(`http://localhost:5000/create/topics/${course}`)
        .then((res) => res.json())
        .then((data: Topic[]) =>
          setTopics(
            data.map((t) => ({
              ...t,
              selected: false,
              hours_studied: "",
              quiz_score: "",
              completion_date: "",
            }))
          )
        )
        .catch((err) => console.error("Error fetching topics:", err));
    } else {
      setTopics([]);
    }
  }, [course]);

  const handleTopicChange = (topicId: number) => {
  setTopics((prev) =>
    prev.map((t) =>
      t.topic_id === topicId
        ? t.selected
          ? {
              ...t,
              selected: false,
              hours_studied: "",
              quiz_score: "",
              completion_date: "",
            }
          : { ...t, selected: true }
        : t
    )
  );
  setErrors((prev) => ({ ...prev, [topicId]: {} }));
};

  const handleInputChange = (
    topicId: number,
    field: "hours_studied" | "quiz_score" | "completion_date",
    value: string

  ) => 
    {
    setTopics((prev) =>
      prev.map((t) =>
        t.topic_id === topicId ? { ...t, [field]: value } : t
      )
    );
    setErrors((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], [field]: "" },
    })); 
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const resetFields = () => {
    setStudentName("");
    setEmail("");
    setCourse("");
    setTopics([]);
    setErrors({});
    setStudentNameError(null);  
    setEmailError(null);
  };

  const handleSubmit = () => {
    const selectedTopics = topics.filter((t) => t.selected);
    let newErrors: typeof errors = {};
    let hasError = false;

    if (!studentName.trim()) {
    setStudentNameError("Student Name is required.");
    hasError = true;
  } else {
    setStudentNameError(null);
  }


    if (!email.trim()) {
    setEmailError("Email is required.");
    hasError = true;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    setEmailError("Invalid email format.");
    hasError = true;
  } else {
    setEmailError(null);
  }

    for (const t of selectedTopics) {
      const topicErrors: Partial<Record<"quiz_score" | "hours_studied" | "completion_date", string>> = {};

      if (Number(t.quiz_score) > 10 || Number(t.quiz_score) < 1) {
        topicErrors.quiz_score = "Quiz Score cannot be less than 1 or more than 10.";
      }
      if (Number(t.hours_studied) > 24) {
        topicErrors.hours_studied = "Hours Studied cannot be more than 24.";
      }
      if (t.completion_date && new Date(t.completion_date) > new Date()) {
        topicErrors.completion_date = "Completion date cannot be in the future.";
      }

      if (Object.keys(topicErrors).length > 0) {
        newErrors[t.topic_id] = topicErrors;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
     
      return;
    }
    
     if (hasError) {
    setErrors(newErrors);
    return;
  }
 

    const payload = {
      student_name: studentName,
      email,
      course_name: courses.find((c) => c.course_id.toString() === course)
        ?.course_name,
      topics: selectedTopics.map((t) => ({
        topic_name: t.topic_name,
        quiz_score: Number(t.quiz_score),
        hours_studied: Number(t.hours_studied),
        completion_date: t.completion_date,
      })),
    };

    fetch("http://localhost:5000/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        resetFields();
        onClose();
        onStudentAdded();
        setOpenSnackbar(true);
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <>
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <div className="custom-dialog"></div>
      <div className="custom-dialog-title">
        <DialogTitle>Add Student</DialogTitle>
      </div>
      <DialogContent>
        <TextField
          label="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          fullWidth
          margin="normal"
          error={!!studentNameError}
          helperText={studentNameError}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}

        />
        <TextField
          select
          label="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          fullWidth
          margin="normal"
        >
          {courses.map((c) => (
            <MenuItem key={c.course_id} value={c.course_id.toString()}>
              {c.course_name}
            </MenuItem>
          ))}
        </TextField>

        <FormGroup>
          {topics.map((topic) => (
            <div key={topic.topic_id} className="topic-container">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={topic.selected}
                    onChange={() => handleTopicChange(topic.topic_id)}
                  />
                }
                label={topic.topic_name}
              />
              {topic.selected && (
                <div className="topic-inputs">
                  <TextField
                    label="Hours Studied"
                    type="number"
                    value={topic.hours_studied}
                    onChange={(e) =>
                      handleInputChange(
                        topic.topic_id,
                        "hours_studied",
                        e.target.value
                      )
                    }
                    fullWidth
                    slotProps={{ htmlInput: { step: "0.1", min: 0, max: 24 } }}
                    error={!!errors[topic.topic_id]?.hours_studied}
                    helperText={errors[topic.topic_id]?.hours_studied}
                  />
                  <TextField
                    label="Quiz Score"
                    type="number"
                    value={topic.quiz_score}
                    onChange={(e) =>
                      handleInputChange(
                        topic.topic_id,
                        "quiz_score",
                        e.target.value
                      )
                    }
                    fullWidth
                    slotProps={{ htmlInput: { min: 1, max: 10 }  }}
                    error={!!errors[topic.topic_id]?.quiz_score}
                    helperText={errors[topic.topic_id]?.quiz_score}
                  />
                  <TextField
                    label="Completion Date"
                    type="date"
                    value={topic.completion_date}
                    onChange={(e) =>
                      handleInputChange(
                        topic.topic_id,
                        "completion_date",
                        e.target.value
                      )
                    }
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { max: new Date().toISOString().split("T")[0] }
                    }}
                    error={!!errors[topic.topic_id]?.completion_date}
                    helperText={errors[topic.topic_id]?.completion_date}
                  />
                </div>
              )}
            </div>
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>    
    </DialogActions>
  </Dialog>
  <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
        >
          Student added successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default StudentDialog;
