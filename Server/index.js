import express from "express";
import db from "./db.js";
import cors from "cors";
import courseTopicRoutess from "./routes/coursetop.js";
import progressRoutes from "./routes/line_chart.js";
import studentRoutes from "./routes/students_progress.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", courseTopicRoutess);
app.use("/", progressRoutes);
app.get("/", (req, res) => res.json("Hello, this is Backend"));
app.use("/student", studentRoutes);
  

app.listen(5000, () => {
  console.log("Connected to backend on port 5000");
});
