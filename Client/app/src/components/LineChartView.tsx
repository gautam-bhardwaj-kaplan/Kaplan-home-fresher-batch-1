

import React, { useEffect, useState } from "react";
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
import axios from "axios";

interface LineChartViewProps {
  studentId: string | null;
  courseId: string | null;
  topicId: string | null;
  timeframe: "daily" | "weekly";
}

interface ChartData {
  date?: string;
  week?: string;
  total_hours: number;
}

const LineChartView: React.FC<LineChartViewProps> = ({
  studentId,
  courseId,
  topicId,
  timeframe,
}) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!studentId) return;

      try {
        const params: any = { student_id: studentId };
        if (courseId !== null) params.course_id = courseId;
        if (topicId !== null) params.topic_id = topicId;

        const endpoint = `http://localhost:5000/linechart/${timeframe}`;
        const res = await axios.get(endpoint, { params });

        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setData([]);
      }
    };

    fetchChartData();
  }, [studentId, courseId, topicId, timeframe]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {studentId ? `Study Progress (Student ${studentId})` : "Study Progress"}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={timeframe === "daily" ? "date" : "week"}
              tick={{ fontSize: 12 }}
              label={{
                value: timeframe === "daily" ? "Days" : "Weeks",
                position: "insideBottom",
                offset: -5,
                fontSize: 14,
              }}
            />
            <YAxis
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                fontSize: 14,
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_hours"
              stroke="#1976d2"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartView;
