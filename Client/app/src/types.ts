export interface QuizScore {
  studentName: string;
  courseName: string;
  topicName: string;
  score: number;
}

export interface Student {
  id: number;
  name: string;
}

export interface SidebarProps{
    student: Student[];
    onSelect : (student : Student) => void;
    selectedStudent : Student | null;
}

 export interface Course {
  course_id: number;
  course_name: string;
}

export interface Topic {
  topic_id: number;
  topic_name: string;
}

export interface TopicSelection extends Topic {
  selected: boolean;
  hours_studied: string;
  quiz_score: string;
  completion_date: string;
}

export interface Props {
  open: boolean;
  onClose: () => void;
  onStudentAdded: () => void; 
}