import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";

const COLORS = ["#17a673", "#ff7849", "#0d4c92", "#8b9aad"];

export function ClaimsFunnelChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8b9aad" }} axisLine={false} tickLine={false} />
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
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
