import React, { useState, useMemo } from "react";
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  const fetchCourses = async (stud_id: number) => {
    setLoadingCourses(true);
    try {
      const res = await axios.get<Course[]>(
        `http://localhost:5000/student/${stud_id}/courses`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch courses for selected student
  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    fetchCourses(student.stud_id);
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
  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (value.length >= 2 || value.length === 0) {
      setSearchQuery(value);
    }
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    const container = document.querySelector(".progressbar-container");
    if (!container) return;

    if (isOpen && window.innerWidth <= 768) {
      container.classList.add("sidebar-open");
    } else {
      container.classList.remove("sidebar-open");
    }
  }, []);
  return (
    <>
      <HeaderPb title="Course Progress" showEnrollment />
      <div className="progressbar-container">
        <SidebarPb
          onSelect={handleStudentSelect}
          selectedStudent={selectedStudent}
          onToggle={handleSidebarToggle}
        />
        <div className="progressbar-content">
          <FiltersPb
            completionFilter={completionFilter}
            sortFilter={sortFilter}
            searchQuery={searchInput}
            onCompletionFilter={handleCompletionFilter}
            onSortFilter={handleSortFilter}
            onNavigate={(page) => console.log("Navigate to:", page)}
            onClearFilters={handleClearFilters}
            onSearch={handleSearch}
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
