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
import "./styling/linechart.css";

interface LineChartViewProps {
  studentId: string | null;
  studentName: string | null;
  courseId: string | null;
  TopicId: string[];
  timeframe: "daily" | "weekly";
}

interface ChartData {
  date?: string;
  week?: string;
  total_hours: number;
}

const LineChartView: React.FC<LineChartViewProps> = ({
  studentId,
  studentName,
  courseId,
  TopicId,
  timeframe,
}) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!studentId) {
        setData([]);
        return;
      }

      try {
        const params: any = { student_id: studentId };
        if (courseId) params.course_id = courseId;
        if (TopicId.length > 0) params.topic_id = TopicId.join(",");

        const endpoint = `http://localhost:5000/${timeframe}`;

        const res = await axios.get(endpoint, { params });

        setData(res.data);
      } catch (err) {
        setData([]);
      }
    };

    fetchChartData();
  }, [studentId, courseId, TopicId, timeframe]);

  return (
    <Card className="linechart-card">
      <CardContent>
        <Typography variant="h6" className="linechart-title">
          {studentName ? `Study Hours (${studentName})` : "Study Hours"}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={timeframe === "daily" ? "date" : "week"}
              tick={{ fontSize: 12, dy: 8 }}
              textAnchor="middle"
              height={30}
              label={{
                value: timeframe === "daily" ? "Days" : "Weeks",
                position: "insideBottom",
                offset: -17,
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
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
            />
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
