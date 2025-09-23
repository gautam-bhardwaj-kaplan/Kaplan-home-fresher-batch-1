import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import {
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  InputLabel,
  CircularProgress,
  Box,
} from '@mui/material';

import SidebarPb from '../components/SidebarPb.tsx';
import Header from "../components/HeaderPb.tsx";
import { QuizScore } from '../types.ts';
import '../components/styles/quiz_page.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QuizScorePage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<{ stud_id: number; name: string } | null>(null);
  const [allData, setAllData] = useState<QuizScore[]>([]);
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [studentName, setStudentName] = useState('Select a student');
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
  useEffect(() => {
    if (selectedStudent) return;

    const fetchFirstStudent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/student/sidebar/all?page=1&limit=1`);
        if (!res.ok) throw new Error('Failed to fetch first student');
        const data = await res.json();
        const firstStudent = data?.students?.[0];
        if (firstStudent) {
          setSelectedStudent(firstStudent);
        } else {
          setError('No students available.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not fetch students.');
      }
    };

    fetchFirstStudent();
  }, [selectedStudent]);

  
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchScores = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/quiz/${selectedStudent.stud_id}`);
        if (!res.ok) throw new Error('Failed to fetch quiz scores');

        const data: QuizScore[] = await res.json();
        setAllData(data);

        if (data.length > 0) {
          setStudentName(data[0].studentName || selectedStudent.name);
          const uniqueCourses = [...new Set(data.map((item) => item.courseName))];
          setCourses(uniqueCourses);
          setSelectedCourse(uniqueCourses[0] || '');
        } else {
          setAllData([]);
          setCourses([]);
          setSelectedCourse('');
          setChartData(null);
          setError('No scores found for this student.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not fetch quiz scores.');
        setAllData([]);
        setCourses([]);
        setSelectedCourse('');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [selectedStudent]);

  
  useEffect(() => {
    if (!allData.length || !selectedCourse) {
      setChartData(null);
      return;
    }

    const courseData = allData.filter((it) => it.courseName === selectedCourse);
    const topics = [...new Set(courseData.map((it) => it.topicName))];
    const scores = topics.map((t) => {
      const found = courseData.find((d) => d.topicName === t);
      return found ? found.score : null;
    });

    const colors = scores.map((score, i) =>
      score !== null ? `hsl(${(i * 360) / Math.max(1, topics.length)}, 70%, 60%)` : 'transparent'
    );

    const cfg: ChartData<'bar'> = {
      labels: topics,
      datasets: [
        {
          label: `Quiz Scores for ${selectedCourse}`,
          data: scores,
          backgroundColor: colors,
          minBarLength: 5,
        },
      ],
    };

    setChartData(cfg);
  }, [allData, selectedCourse]);

  return (
    <>
      <div className="header-bar-quiz">
        <Header title="Quiz Score" />
        <div className="quiz-container">
          <SidebarPb
            selectedStudent={selectedStudent}
            onSelect={setSelectedStudent}
          />
          <div className="main-content-quiz">
            {loading && !error && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && error && (
              <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )}

            {!loading && !error && courses.length > 0 && (
              <div className="course-select">
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="course-dropdown"
                >
                  {courses.map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </div>
            )}

            {!loading && !error && chartData && (
              <Card className="chart-container">
                <CardContent sx={{ width: '100%', height: '100%' }}>
                  <Bar data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: `${studentName}'s Quiz Scores for ${selectedCourse}` },
                    },
                    scales: {
                      x: { title: { display: true, text: 'Topics' }, ticks: { display: false }, grid: { display: false } },
                      y: { title: { display: true, text: 'Scores' }, beginAtZero: true, min: 0, max: 10, ticks: { stepSize: 1 }, grid: { display: false } },
                    },
                  }} />
                </CardContent>
              </Card>
            )}

            
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizScorePage;
