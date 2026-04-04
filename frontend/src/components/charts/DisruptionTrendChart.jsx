import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function DisruptionTrendChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "#8b9aad" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8b9aad" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#06141b",
              border: "none",
              borderRadius: 12,
              padding: "8px 14px"
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
            itemStyle={{ color: "#fff", fontWeight: 700 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0d4c92"
            strokeWidth={3}
            dot={{ r: 5, fill: "#0d4c92", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7, fill: "#0d4c92", strokeWidth: 2, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
