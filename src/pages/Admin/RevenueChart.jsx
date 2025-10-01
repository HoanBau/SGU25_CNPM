import React, { useMemo, useState } from "react";
import "./RevenueChart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const RevenueChart = ({ orders }) => {
  const [filter, setFilter] = useState("month"); // "day" | "month" | "year"

  // Tạo dữ liệu chart
  const chartData = useMemo(() => {
    const dataMap = {};

    orders.forEach(order => {
      const date = new Date(order.date || order.id);
      let key;

      if (filter === "ngày") key = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      else if (filter === "tháng") key = `${date.getMonth()+1}/${date.getFullYear()}`;
      else key = `${date.getFullYear()}`;

      dataMap[key] = (dataMap[key] || 0) + (order.totalAmount || 0);
    });

    return Object.entries(dataMap)
      .sort((a,b) => new Date(a[0]) - new Date(b[0]))
      .map(([key, value]) => ({ name: key, revenue: value }));
  }, [orders, filter]);

  // Scale trục Y và làm tròn lên hàng nghìn
  const maxRevenue = chartData.length
    ? Math.ceil(Math.max(...chartData.map(d => d.revenue)) / 1000) * 1000
    : 1000;

  // Format tooltip
  const formatTooltipLabel = (label) => {
    if (filter === "day") return `Ngày: ${label}`;
    if (filter === "month") return `Tháng: ${label}`;
    return `Năm: ${label}`;
  };

  return (
    <div className="revenue-chart-container">
      <h2>Doanh thu theo {filter}</h2>

      <div className="revenue-chart-buttons">
        <button
          className={filter === "ngày" ? "active" : ""}
          onClick={() => setFilter("ngày")}
        >
          Theo ngày
        </button>
        <button
          className={filter === "tháng" ? "active" : ""}
          onClick={() => setFilter("tháng")}
        >
          Theo tháng
        </button>
        <button
          className={filter === "year" ? "active" : ""}
          onClick={() => setFilter("năm")}
        >
          Theo năm
        </button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid stroke="#F0F0F0" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#333" }} />
          <YAxis
            tick={{ fill: "#333" }}
            domain={[0, maxRevenue]}
            tickCount={6}
            tickFormatter={(value) => (Math.ceil(value / 1000) * 1000).toLocaleString("vi-VN") + " ₫"}
          />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#FF6B35"
            strokeWidth={3}
            activeDot={{ r: 8, fill: "#FF6B35", stroke: "#FF6B35" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
