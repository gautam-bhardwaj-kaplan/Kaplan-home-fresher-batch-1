import express from "express"
import db from './db.js';
import cors from "cors"
import studentRoutes from "./routes/students_progress.js";

const app = express();

app.use(express.json());
app.use(cors());




app.get("/", (req, res) => res.json("Hello, this is Backend"));


app.use("/student", studentRoutes);


app.listen(5000 ,() =>{
    console.log("COnnected to backend on port 5000");

});



