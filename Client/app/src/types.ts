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

