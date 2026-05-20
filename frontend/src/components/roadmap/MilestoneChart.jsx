import { memo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white shadow-lg p-4 rounded-xl border border-slate-200 text-sm">
      <p className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }} className="text-xs font-medium py-0.5">
          {entry.name}: <span className="text-slate-800">{entry.value ?? "—"} days</span>
        </p>
      ))}
    </div>
  );
};

export const MilestoneChart = memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium italic">
        Chart will populate as you complete milestones.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="milestone"
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          label={{
            value: "DAYS",
            angle: -90,
            position: "insideLeft",
            fill: "#94a3b8",
            fontSize: 10,
            fontWeight: 700,
            offset: 15
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "20px" }}
          iconType="circle"
          iconSize={6}
        />
        <Line
          type="monotone"
          dataKey="expected_day"
          stroke="#6366f1"
          strokeWidth={3}
          name="Scheduled"
          dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="actual_day"
          stroke="#10b981"
          strokeWidth={3}
          name="Performance"
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
