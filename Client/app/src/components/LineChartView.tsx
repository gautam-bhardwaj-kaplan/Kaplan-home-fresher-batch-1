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
import "./styling/linechart.css"; // import CSS

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
  const dailyData = [
    { date: "2025-09-01", hours: 2 },
    { date: "2025-09-02", hours: 3 },
    { date: "2025-09-03", hours: 1.5 },
    { date: "2025-09-04", hours: 4 },
    { date: "2025-09-05", hours: 2.5 },
    { date: "2025-09-06", hours: 3 },
    { date: "2025-09-07", hours: 1 },
  ];

  const weeklyData = [
    { date: "2025-08-04", hours: 12 },
    { date: "2025-08-11", hours: 15 },
    { date: "2025-08-18", hours: 10 },
    { date: "2025-08-25", hours: 18 },
  ];

  const data = timeframe === "daily" ? dailyData : weeklyData;

  return (
    <Card className="linechart-card">
      <CardContent>
        <Typography className="linechart-title" variant="h6">
          {studentId ? `Study Progress (Student ${studentId})` : "Study Progress"}
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              angle={-20} // optional tilt to avoid overlapping
              textAnchor="end"
              interval={0}
              label={{
                value: timeframe === "daily" ? "Days" : "Weeks",
                position: "insideBottom",
                offset: 20,
                fontSize: 12,
                fill: "#555",
              }}
            />
            <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
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
