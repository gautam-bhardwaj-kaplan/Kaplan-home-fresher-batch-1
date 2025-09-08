import express from "express"
import db from './db.js';
import cors from "cors"
import studentRoutes from "./routes/crud.js";
import courseTopicRoutes from "./routes/coursetopic.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/students", studentRoutes);
app.use("/", courseTopicRoutes);

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

app.listen(5000 ,() =>{
    console.log("COnnected to backend on port 5000");

});



