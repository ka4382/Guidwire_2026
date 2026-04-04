import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#17a673", "#ff7849", "#0d4c92", "#8b9aad"];

export function PayoutTrendChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            cornerRadius={6}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
