import express from "express"
import db from './db.js';
import cors from "cors"
<<<<<<< HEAD
import studentRoutes from "./routes/crud.js";
import courseTopicRoutes from "./routes/coursetopic.js";
import courseTopicRoutess from "./routes/coursetop.js";
import progressRoutes from "./routes/line_chart.js";

=======
import studentRoutes from "./routes/students_progress.js";
>>>>>>> 375ef334c27f8da314f1155897aea6df41e0e61e

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", courseTopicRoutess);

app.use("/api/coursetopic", courseTopicRoutes);
app.use("/api/linechart", progressRoutes);


app.use("/students", studentRoutes);
app.use("/", courseTopicRoutes);
app.use("/progress", progressRoutes);

<<<<<<< HEAD
app.get("/student",async (req,res)=> {
    try{
    const [rows] = await db.query("SELECT * FROM student");
    res.json(rows);
  } catch (err) {
    console.error(":x: SQL error:", err);
    res.status(500).json(err);
  }
});

app.get("/",(req,res) => {
    res.json("Hello this is Backend")
});
=======


app.get("/", (req, res) => res.json("Hello, this is Backend"));


app.use("/student", studentRoutes);

>>>>>>> 375ef334c27f8da314f1155897aea6df41e0e61e

app.listen(5000 ,() =>{
    console.log("COnnected to backend on port 5000");

});



