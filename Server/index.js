import express from 'express';
import db from './db.js';
import cors from 'cors';
import quizRoutes from './routes/quiz.js';
import studentsRoutes from './routes/student_list.js'

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use('/quiz', quizRoutes);
app.use('/students', studentsRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

