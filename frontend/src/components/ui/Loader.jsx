import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function Loader({ label = "Loading BlinkShield AI..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-20"
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-[3px] border-slate-200" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-transparent border-t-surge" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield size={16} className="text-surge" strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </motion.div>
  );
}
