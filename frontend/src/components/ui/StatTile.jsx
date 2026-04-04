import { motion } from "framer-motion";
import { Card } from "./Card";

export function StatTile({ label, value, meta, icon: Icon, trend, iconBg, iconColor, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`h-full p-5 ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl" style={{ fontVariantNumeric: "tabular-nums" }}>
              {value}
            </p>
            {meta ? (
              <p className="mt-1.5 text-xs text-slate-500">{meta}</p>
            ) : null}
            {trend != null ? (
              <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </div>
            ) : null}
          </div>
          {Icon ? (
            <div className={`shrink-0 rounded-xl p-2.5 ${iconBg || "bg-[#e6f9f1]"}`}>
              <Icon size={18} className={iconColor || "text-[#17a673]"} strokeWidth={2} />
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
