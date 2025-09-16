import React, { useEffect, useState, useMemo } from "react";
import HeaderPb from "../components/HeaderPb.tsx";
import SidebarPb from "../components/SidebarPb.tsx";
import FiltersPb from "../components/FiltersPb.tsx";
import CourseCard from "../components/CourseCardPb.tsx";
import axios from "axios";
import "./ProgressBar.css";

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

  // filter states
const [completionFilter, setCompletionFilter] = useState<number | null>(() => {
  const saved = localStorage.getItem("completionFilter");
  return saved !== null && saved !== "" ? Number(saved) : null;
});

const [sortFilter, setSortFilter] = useState<string | null>(() => {
  const saved = localStorage.getItem("sortFilter");
  return saved !== null && saved !== "" ? saved : null;
});

const handleCompletionFilter = (val: number | null) => {
  setCompletionFilter(val);
  localStorage.setItem("completionFilter", val !== null ? val.toString() : "");
};

const handleSortFilter = (val: string | null) => {
  setSortFilter(val);
  localStorage.setItem("sortFilter", val || "");
};



  // Fetch students
useEffect(() => {
  axios
    .get<Student[]>("http://localhost:5000/student/all")
    .then((res) => {
      setStudents(res.data);

      if (res.data.length > 0) {
        const firstStudent = res.data[0];
        setSelectedStudent(firstStudent);

        // Fetch that student's courses
        axios
          .get<Course[]>(`http://localhost:5000/student/${firstStudent.stud_id}/courses`)
          .then((res2) => setCourses(res2.data))
          .catch((err) => console.error("Error fetching courses:", err));
      }
    })
    .catch((err) => console.error("Error fetching students:", err));
}, []);


  // Fetch courses for selected student
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    axios
      .get<Course[]>(`http://localhost:5000/student/${student.stud_id}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  };

  // apply filters
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (completionFilter != null) {
    if (completionFilter === 0) {
    
    result = result.filter(c => c.progress_percentage === 0);
    } else {
    
    result = result.filter(c => c.progress_percentage > completionFilter);
    }
 }


    if (sortFilter === "quiz") {
      result.sort((a, b) => b.avg_quiz_score-a.avg_quiz_score);
    } else if (sortFilter === "progress") {
      result.sort((a, b) => b.progress_percentage - a.progress_percentage);
    }

    return result;
  }, [courses, completionFilter, sortFilter]);

  return (
    <>
      <HeaderPb />
      <div className="progressbar-container">
        <SidebarPb 
        students={students} 
        onSelect={handleStudentSelect} 
        selectedStudent={selectedStudent}/>

        <div className="progressbar-content">
         
          <FiltersPb
           completionFilter={completionFilter }  
           sortFilter={sortFilter }
            onCompletionFilter={handleCompletionFilter}
            onSortFilter={handleSortFilter}
            onNavigate={(page) => console.log("Navigate to:", page)}
          />

          <div className="courses-frame">
            {selectedStudent === null ? (
              <p>Select a student to view courses</p>
            ) : filteredCourses.length === 0 ? (
              <p>No courses found for {selectedStudent.name}</p>
            ) : (
              <CourseCard courses={filteredCourses} studentId={selectedStudent!.stud_id} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
