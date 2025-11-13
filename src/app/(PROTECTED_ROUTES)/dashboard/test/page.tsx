"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/features/landing/hooks/useTransactions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const LineChartAxisInterval = () => {
  const {
    transactionLoading,
    monthly,
    recentShipped,
    recentStocked,
    refetchRecentShipped,
    refetchRecentStocked,
    recentShippedError,
  } = useTransactions();

  const renderChart = (interval: any) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthly} margin={{ left: 0, right: 0, top: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={interval} />
        <YAxis />
        <Line
          type="monotone"
          dataKey="shipped"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  return <>{renderChart(1)}</>;
};

export default LineChartAxisInterval;
