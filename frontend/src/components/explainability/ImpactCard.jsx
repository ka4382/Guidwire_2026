import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatters";

export function ImpactCard({ lossAmount = 600, payoutAmount = 0 }) {
  const savings = payoutAmount;
  const netLoss = Math.max(0, lossAmount - payoutAmount);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
    >
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Financial Impact Comparison
        </p>
      </div>

      <div className="p-4 grid gap-4">
         {/* Without BlinkShield */}
        <div className="flex justify-between items-center bg-red-50/50 p-3 rounded-xl border border-red-100">
          <div>
            <p className="text-xs font-semibold text-slate-500">Without BlinkShield AI</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Worker bears full loss</p>
          </div>
          <p className="text-lg font-extrabold text-red-600 line-through decoration-red-300">
            {formatCurrency(lossAmount)}
          </p>
        </div>

         {/* With BlinkShield AI */}
        <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
          <div>
            <p className="text-xs font-semibold text-slate-500">With BlinkShield AI</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Automated safety net</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-emerald-600">+{formatCurrency(payoutAmount)}</p>
             <p className="text-lg font-extrabold text-ink">Net Loss: {formatCurrency(netLoss)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
