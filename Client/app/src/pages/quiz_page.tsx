import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

import Sidebar from '../components/sidebar_quiz.tsx';
import Header from '../components/Header_quiz.tsx';
import { QuizScore } from '../types.ts';
import '../components/styles/quiz_page.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';

const QuizScorePage: React.FC = () => {
  const { studentId: paramId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [allData, setAllData] = useState<QuizScore[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Select a student');
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');


  useEffect(() => {
    const needsFix =
      !paramId || paramId === ':studentId' || location.pathname.includes(':studentId');

    if (!needsFix) return;

    let cancelled = false;
    const redirectToFirst = async () => {
      try {
        setRedirecting(true);
        setLoading(true);
        const res = await fetch(`${API_BASE}/students?page=0&rowsPerPage=1`);
        if (!res.ok) {
          
          const text = await res.text().catch(() => '');
          throw new Error(`Could not load students for redirect: ${text || res.status}`);
        }
        const data = await res.json();
        const first = data?.rows?.[0];
        if (!cancelled) {
          if (first && first.id) {
           
            navigate(`/quiz/${first.id}`, { replace: true });
          } else {
            setError('No students available to show.');
          }
        }
      } catch (err: any) {
        console.error('redirectToFirst error', err);
        if (!cancelled) setError(err?.message || 'Failed to redirect to first student.');
      } finally {
        if (!cancelled) {
          setRedirecting(false);
          setLoading(false);
        }
      }
    };

    redirectToFirst();
    return () => {
      cancelled = true;
    };
  }, [paramId, location.pathname, navigate]);

  useEffect(() => {
    let cancelled = false;
    const fetchScores = async () => {
      if (!paramId || paramId === ':studentId') {
        
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/quiz/${paramId}`);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          let msg = `Failed to fetch scores (status ${res.status})`;
          try {
            const parsed = JSON.parse(text);
            msg = parsed.message || msg;
          } catch {}
          throw new Error(msg);
        }
        const data: QuizScore[] = await res.json();

        if (!cancelled) {
          if (!data || data.length === 0) {
            setAllData([]);
            setCourses([]);
            setSelectedCourse('');
            setChartData(null);
            setStudentName('Select a student');
            setError('No scores found for this student.');
          } else {
            setStudentName(data[0].studentName || 'Student');
            setAllData(data);
            const uniqueCourses = [...new Set(data.map((item) => item.courseName))];
            setCourses(uniqueCourses);
            setSelectedCourse(uniqueCourses[0] || '');
            setError('');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('fetchScores error:', err);
          setError(err instanceof Error ? err.message : 'Could not fetch quiz scores.');
          setAllData([]);
          setCourses([]);
          setSelectedCourse('');
          setChartData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchScores();
    return () => {
      cancelled = true;
    };
  }, [paramId]);

 
  useEffect(() => {
    if (allData.length > 0 && selectedCourse) {
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
    } else {
      setChartData(null);
    }
  }, [allData, selectedCourse]);

  const handleCourseChange = (course: string) => setSelectedCourse(course);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `${studentName}'s Quiz Scores for ${selectedCourse}` },
    },
    scales: {
      x: { title: { display: true, text: 'Topics' }, ticks: { display: false }, grid: { display: false } },
      y: {
        title: { display: true, text: 'Scores' },
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: { stepSize: 1 },
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <div className="header-bar-quiz">
        <Header />
        <div className="quiz-container">
          <Sidebar />
          <div className="main-content-quiz">

            {(redirecting || loading) && !error && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {!loading && !error && courses.length > 0 && (
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

            {!loading && !error && chartData && (
              <Card className="chart-container">
                <CardContent sx={{ width: '100%', height: '100%' }}>
                  <Bar options={options} data={chartData} />
                </CardContent>
              </Card>
            )}

            {!loading && !error && !chartData && !courses.length && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                No data available for the selected course or student.
              </Typography>
            )}
          </div>
        </div>
        </div>
    </>
  );
};

export default QuizScorePage;
