const palette = {
  low: "bg-slate-50 text-slate-600 border border-slate-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-rose-50 text-rose-700 border border-rose-200",
  critical: "bg-red-50 text-red-700 border border-red-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  flagged: "bg-amber-50 text-amber-700 border border-amber-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  created: "bg-blue-50 text-blue-700 border border-blue-200",
  paid: "bg-sky-50 text-sky-700 border border-sky-200",
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactive: "bg-slate-50 text-slate-500 border border-slate-200"
};

const dotColors = {
  low: "bg-slate-400",
  medium: "bg-amber-500",
  high: "bg-rose-500",
  critical: "bg-red-500",
  approved: "bg-emerald-500",
  pending: "bg-amber-500",
  flagged: "bg-amber-500",
  rejected: "bg-red-500",
  created: "bg-blue-500",
  paid: "bg-sky-500",
  active: "bg-emerald-500",
  inactive: "bg-slate-400"
};

export function Badge({ label, tone = "low" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${palette[tone] || palette.low}`}
    >
      <span className={`badge-dot ${dotColors[tone] || dotColors.low}`} />
      {label}
    </span>
  );
}
