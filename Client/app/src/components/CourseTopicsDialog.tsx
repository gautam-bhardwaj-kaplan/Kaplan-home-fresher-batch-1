import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import "./CourseTopicsDialog.css";
import StatusFilterDialog from "./StatusFilter.tsx";

interface Topic {
  topic_id: number;
  topic_name: string;
  quiz_score: string | number; 
  hours_spent: number;
  status: string; 
}

interface CourseTopicsDialogProps {
  open: boolean;
  onClose: () => void;
  studentId: number | null;
  courseId: number | null;
  courseName: string | null;
}

const CourseTopicsDialog: React.FC<CourseTopicsDialogProps> = ({
  open,
  onClose,
  studentId,
  courseId,
  courseName,
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = React.useState<string | null>("all");


  useEffect(() => {
    const fetchTopics = async () => {
      if (open && studentId && courseId) {
        try {
          setLoading(true);
          setStatus("all");
          const res = await axios.get<Topic[]>(
            `http://localhost:5000/student/${studentId}/course/${courseId}/topics/details`
          );
          setTopics(res.data);
          setFilteredTopics(res.data);
        } catch (err) {
          console.error("Failed to fetch topics:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTopics();
  }, [open, studentId, courseId]);

  const visibleTopics = topics.filter((topic) => {
    if (!status || status === "all") return true;
    if (status === "Pending") return topic.status  !== "Completed";
    return topic.status === status;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: "custom-dialog-paper" }}
    >
        
      <DialogTitle className="custom-dialog-title">
        <div className="dialog-title-bar">
        Topics for {courseName}
         <StatusFilterDialog
        statusFilter={status}
        onStatusFilterChange={(val) => setStatus(val)}
      /> 
      </div>
      </DialogTitle>
      

      <DialogContent className="custom-dialog-content">
        {loading ? (
          <Box display="flex" justifyContent="left" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        ) : topics.length === 0 ? (
          <p className="no-topics">No topics found for this course.</p>
          ) : visibleTopics.length === 0 ? (
            <p className="no-topics">
            {status === "Pending" ? "No pending topics!" : `No ${status} topics!`}
            </p>
        ) : (
          <Table className="topics-table">
            <TableHead>
              <TableRow>
                <TableCell className="col-topic">Topic Name</TableCell>
                <TableCell className="col-score">Quiz Score</TableCell>
                <TableCell className="col-status">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleTopics.map((topic, idx) => (
                <TableRow
                  key={topic.topic_id}
                  className={idx % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <TableCell>{topic.topic_name}</TableCell>
                  <TableCell>{topic.quiz_score ?? "Not Started"}</TableCell>
                  <TableCell>{topic.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions className="custom-dialog-actions">
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseTopicsDialog;
