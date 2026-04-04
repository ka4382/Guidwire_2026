import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description, icon: Icon = Inbox }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-8 py-12 text-center"
    >
      <div className="rounded-2xl bg-white p-4 shadow-subtle">
        <Icon size={28} className="text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </motion.div>
  );
}
