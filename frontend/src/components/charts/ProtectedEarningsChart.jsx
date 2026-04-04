import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function ProtectedEarningsChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="surge-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#17a673" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#17a673" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#8b9aad" }} axisLine={false} tickLine={false} />
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
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#17a673"
            strokeWidth={2.5}
            fill="url(#surge-gradient)"
            dot={{ r: 4, fill: "#17a673", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#17a673", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
