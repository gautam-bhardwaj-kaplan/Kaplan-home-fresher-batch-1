import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./EnrollmentChartDialog.css";
import CloseIcon from "@mui/icons-material/Close";
import chartColors from "./chartColors.ts";

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnrollmentData {
  course_id: number;
  course_name: string;
  student_count: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const EnrollmentChartDialog: React.FC<Props> = ({ open, onClose }) => {
  const [data, setData] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} students`;
          },
        },
      },
    },
  };

  useEffect(() => {
    if (!open) return;

    const fetchEnrollment = async () => {
      setLoading(true);
      try {
        const res = await axios.get<EnrollmentData[]>(
          "http://localhost:5000/student/courses/enrollment"
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching enrollment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [open]);

  const chartData = {
    labels: data.map((d) => d.course_name),
    datasets: [
      {
        label: "Students Enrolled",
        data: data.map((d) => d.student_count),
        backgroundColor: chartColors,
      },
    ],
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="enrollment-dialog"
    >
      <DialogTitle className="title-header">
        Course Enrollments
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="close-btn"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="chart-wrapper">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentChartDialog;
