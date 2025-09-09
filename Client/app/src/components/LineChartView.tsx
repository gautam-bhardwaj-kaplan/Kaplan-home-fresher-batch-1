import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

interface LineChartViewProps {
  studentId: string | null;
  courseId: string | null;
  topicId: string | null;
  timeframe: "daily" | "weekly";
}

const LineChartView: React.FC<LineChartViewProps> = ({
  studentId,
  courseId,
  topicId,
  timeframe,
}) => {
  // ✅ Dummy data
  const dummyData =
    timeframe === "daily"
      ? [
          { day: "Mon", hours: 2 },
          { day: "Tue", hours: 3 },
          { day: "Wed", hours: 1.5 },
          { day: "Thu", hours: 4 },
          { day: "Fri", hours: 2.5 },
          { day: "Sat", hours: 3 },
          { day: "Sun", hours: 1 },
        ]
      : [
          { week: "Week 1", hours: 12 },
          { week: "Week 2", hours: 15 },
          { week: "Week 3", hours: 10 },
          { week: "Week 4", hours: 18 },
        ];

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {studentId ? `Study Progress (Student ${studentId})` : "Study Progress"}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dummyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeframe === "daily" ? "day" : "week"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hours" stroke="#1976d2" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartView;
