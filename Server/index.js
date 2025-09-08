import express from "express"
import db from './db.js';
import cors from "cors"
import studentRoutes from "./routes/students_progress.js";

const app = express();

app.use(express.json());
app.use(cors());


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

app.get("/", (req, res) => res.json("Hello, this is Backend"));


app.use("/students", studentRoutes);


app.listen(5000 ,() =>{
    console.log("COnnected to backend on port 5000");

});



