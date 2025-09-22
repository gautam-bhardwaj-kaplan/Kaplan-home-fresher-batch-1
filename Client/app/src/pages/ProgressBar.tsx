import React, { useEffect, useState, useMemo } from "react";
import HeaderPb from "../components/HeaderPb.tsx";
import SidebarPb from "../components/SidebarPb.tsx";
import FiltersPb from "../components/FiltersPb.tsx";
import CourseCard from "../components/CourseCardPb.tsx";
import axios from "axios";
import "./ProgressBar.css";
import { CircularProgress } from "@mui/material";

interface Student {
  stud_id: number;
  name: string;
}

interface Course {
  course_id: number;
  course_name: string;
  progress_percentage: number;
  completed_topics: number;
  total_topics: number;
  total_hours_studied: number;
  avg_quiz_score: number;
}

const ProgressBar: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  // filter states
  const [completionFilter, setCompletionFilter] = useState<number | null>(
    () => {
      const saved = localStorage.getItem("completionFilter");
      return saved !== null && saved !== "" ? Number(saved) : null;
    }
  );

  const [sortFilter, setSortFilter] = useState<string | null>(() => {
    const saved = localStorage.getItem("sortFilter");
    return saved !== null && saved !== "" ? saved : null;
  });

  const handleCompletionFilter = (val: number | null) => {
    setCompletionFilter(val);
    localStorage.setItem(
      "completionFilter",
      val !== null ? val.toString() : ""
    );
  };

  const handleSortFilter = (val: string | null) => {
    setSortFilter(val);
    localStorage.setItem("sortFilter", val || "");
  };

  const handleClearFilters = () => {
    setCompletionFilter(null);
    setSortFilter(null);
    localStorage.removeItem("completionFilter");
    localStorage.removeItem("sortFilter");
  };

  // Fetch students
  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const res = await axios.get<Student[]>(
          "http://localhost:5000/student/all"
        );
        setStudents(res.data);

        if (res.data.length > 0) {
          const firstStudent = res.data[0];
          setSelectedStudent(firstStudent);
          setLoadingCourses(true);

          // Fetch that student's courses
          try {
            const res2 = await axios.get<Course[]>(
              `http://localhost:5000/student/${firstStudent.stud_id}/courses`
            );
            setCourses(res2.data);
          } catch (err) {
            console.error("Error fetching courses:", err);
          } finally {
            setLoadingCourses(false);
          }
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudentsAndCourses();
  }, []);

  // Fetch courses for selected student
  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    setLoadingCourses(true);
    try {
      const res = await axios.get<Course[]>(
        `http://localhost:5000/student/${student.stud_id}/courses`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // apply filters
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (completionFilter != null) {
      if (completionFilter === 0) {
        result = result.filter((c) => c.progress_percentage === 0);
      } else {
        result = result.filter((c) => c.progress_percentage > completionFilter);
      }
    }

    if (sortFilter === "quiz") {
      result.sort((a, b) => b.avg_quiz_score - a.avg_quiz_score);
    } else if (sortFilter === "progress") {
      result.sort((a, b) => b.progress_percentage - a.progress_percentage);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((c) =>
        c.course_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [courses, completionFilter, sortFilter, searchQuery]);

  return (
    <>
      <HeaderPb />
      <div className="progressbar-container">
        <SidebarPb
          students={students}
          onSelect={handleStudentSelect}
          selectedStudent={selectedStudent}
        />

        <div className="progressbar-content">
          <FiltersPb
            completionFilter={completionFilter}
            sortFilter={sortFilter}
            searchQuery={searchQuery}
            onCompletionFilter={handleCompletionFilter}
            onSortFilter={handleSortFilter}
            onNavigate={(page) => console.log("Navigate to:", page)}
            onClearFilters={handleClearFilters}
            onSearch={setSearchQuery}
          />

          <div className="courses-frame">
            {!selectedStudent || loadingCourses ? (
              <div className="loader-container">
                <CircularProgress />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="no-courses-container">
                <p>No courses found for {selectedStudent.name} !</p>
              </div>
            ) : (
              <CourseCard
                courses={filteredCourses}
                studentId={selectedStudent!.stud_id}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
