import express from "express";
import db from "./db.js";
import cors from "cors";
import courseTopicRoutess from "./routes/coursetop.js";
import progressRoutes from "./routes/line_chart.js";
import studentRoutes from "./routes/students_progress.js";
import sidebarRoutes from "./routes/Sidebar.js";

import quizRoutes from "./routes/quiz.js";
import studentsRoutes from "./routes/student_list.js";
import createRoutes from "./routes/create.js";
import sidebarRoutes from "./routes/Sidebar.js";
import homeStudentsRouter from "./routes/homeStudents.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use("/", courseTopicRoutess);
app.use("/", progressRoutes);
app.use("/quiz", quizRoutes);
app.use("/students", studentsRoutes);
app.use("/create", createRoutes);
app.use("/student/sidebar", sidebarRoutes);

app.get("/", (req, res) => res.json("Hello, this is Backend"));
app.use("/student", studentRoutes);
app.use("/student/sidebar", sidebarRoutes);
app.use("/student/home", homeStudentsRouter);

app.listen(5000, () => {});
