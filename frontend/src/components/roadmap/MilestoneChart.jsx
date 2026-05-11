import React from "react";
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
    <div className="glass shadow-2xl p-4 rounded-xl border border-white/10 text-sm">
      <p className="font-black text-slate-100 uppercase tracking-widest text-[10px] mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }} className="text-xs font-bold py-0.5">
          {entry.name}: <span className="text-slate-100">{entry.value ?? "—"} days</span>
        </p>
      ))}
    </div>
  );
};

export function MilestoneChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm font-medium italic">
        Chart will populate as you complete milestones.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="milestone"
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          label={{
            value: "DAYS",
            angle: -90,
            position: "insideLeft",
            fill: "#475569",
            fontSize: 10,
            fontWeight: 800,
            offset: 15
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "20px" }}
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
          activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#0f172a" }}
        />
        <Line
          type="monotone"
          dataKey="actual_day"
          stroke="#10b981"
          strokeWidth={3}
          name="Performance"
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#0f172a" }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
