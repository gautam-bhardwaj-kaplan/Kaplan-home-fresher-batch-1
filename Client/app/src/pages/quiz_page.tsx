import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  InputLabel,
} from '@mui/material';

import Sidebar from '../components/sidebar_quiz.tsx';
import Header from '../components/Header_quiz.tsx';

import { QuizScore } from '../types.ts';

import '../components/styles/quiz_page.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QuizScorePage: React.FC = () => {
 const { studentId: paramId } = useParams<{ studentId?: string }>();
const studentId = paramId && paramId !== ":studentId" ? paramId : "101";

  const [chartData, setChartData] = useState<any>(null);
  const [allData, setAllData] = useState<QuizScore[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [studentName, setStudentName] = useState<string>('Select a student');
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    const fetchScores = async () => {
      if (!studentId) {
        setLoading(false);
        setAllData([]);
        setStudentName('Select a student');
        setCourses([]);
        setSelectedCourse('');
        setChartData(null);
        setError('');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/quiz/${studentId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch scores');
        }
        const data: QuizScore[] = await response.json();

        if (data.length > 0) {
          setStudentName(data[0].studentName);
          setAllData(data);
          const uniqueCourses = [...new Set(data.map((item) => item.courseName))];
          setCourses(uniqueCourses);
          setSelectedCourse(uniqueCourses[0] || ''); 
          setError('');
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
  }, [studentId]);

  useEffect(() => {
    if (allData.length > 0 && selectedCourse) {
      processChartData(allData, selectedCourse);
    } else if (!studentId) {
      setChartData(null);
    }
  }, [allData, selectedCourse, studentId]);

  const processChartData = (data: QuizScore[], course: string) => {
    const courseData = data.filter((item) => item.courseName === course);
    const allTopics = [...new Set(courseData.map((item) => item.topicName))];
    const scores = allTopics.map((topic) => {
      const item = courseData.find((d) => d.topicName === topic);
      return item ? item.score : null;
    });

    const colors = scores.map((score, i) =>
      score !== null
        ? `hsl(${(i * 360) / allTopics.length}, 70%, 60%)`
        : 'transparent'
    );
    
    /*const colors = scores.map((score) =>
  score !== null
    ? `hsl(210, ${Math.floor(40 + Math.random() * 60)}%, ${Math.floor(30 + Math.random() * 40)}%)`
    : 'transparent'
);
*/

    setChartData({
      labels: allTopics,
      datasets: [
        {
          label: `Quiz Scores for ${course}`,
          data: scores,
          backgroundColor: colors,
          minBarLength: 5,
        },
      ],
    });
  };

  const handleCourseChange = (course: string) => {
    setSelectedCourse(course);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, 
      title: { display: true, text: `${studentName}'s Quiz Scores for ${selectedCourse}` },
    },
    scales: {
      x: { title: { display: true, text: 'Topics' }, ticks: { display: false } },
      y: {
        title: { display: true, text: 'Scores' },
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <>
      {/* <div className='main-cont'> */}
        <Header />
        <div className ="quiz-container">
        <div className="main-content">
          <Sidebar />
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
            </div >
          ) : error ? (
            <div  className="error-container">
              <Typography color="error">{error}</Typography>
              <Link to="/">Go Back (to select student)</Link>
            </div>
          ) : (
            <>
            
              {courses.length > 0 && (
                <div className="course-select">
                    
                    <InputLabel>Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value as string)}
                    className="course-dropdown"
                  >
                    {courses.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                  </div>
                
              )}
             

              {chartData && (
                <Card className="chart-container">
                  <CardContent sx={{ width: '100%', height: '100%' }}>
                    <Bar options={options} data={chartData} />
                  </CardContent>
                </Card>
              )}
              {!chartData && !error && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  No data available for the selected course or student.
                </Typography>
              )}
            </>
          )}
        </div>
        </div>
      {/* </div> */}
      
    </>
  );
};

export default QuizScorePage;
