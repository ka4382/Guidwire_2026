import { Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { titleCase } from "../../utils/formatters";

export function AIInsights({ type = "premium", explanations = [], riskLevel, reasons = [] }) {
  if (type === "premium") {
    return (
      <div className="space-y-3">
        {explanations.map((exp, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            <p className="text-sm text-slate-600">{exp}</p>
          </div>
        ))}
        {explanations.length === 0 && (
          <p className="text-sm text-slate-400">Activate a policy to see AI-powered premium insights.</p>
        )}
      </div>
    );
  }

  // Claim Explanations
  const icon = riskLevel === "HIGH" ? ShieldAlert : CheckCircle2;
  const iconColor = riskLevel === "HIGH" ? "text-red-500" : "text-emerald-500";
  
  return (
    <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
           <div className={`mt-0.5 shrink-0 ${iconColor}`}>
             {icon({ size: 16 })}
           </div>
           <div>
             <p className="text-sm font-semibold text-ink">
               {reasons.length > 0 ? reasons[0] : "Claim processed successfully by AI Engine."}
             </p>
             {reasons.length > 1 && (
                <ul className="mt-2 space-y-1">
                  {reasons.slice(1).map((r, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                       <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                       {r}
                    </li>
                  ))}
                </ul>
             )}
           </div>
        </div>
    </div>
  );
}
