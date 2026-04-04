import { Card } from "../ui/Card";
import { ShieldAlert, AlertCircle } from "lucide-react";

export function FraudReasonPanel({ reasons = [] }) {
  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} className="text-amber-600" strokeWidth={2.5} />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
          Fraud signal explainability
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {reasons.length ? (
          reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-start gap-2.5 rounded-xl bg-amber-50/50 border border-amber-100 p-3 text-sm leading-relaxed text-slate-600 transition-colors hover:bg-amber-50"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500" strokeWidth={2.5} />
              <span>{reason}</span>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
            No active fraud explanations for this claim.
          </div>
        )}
      </div>
    </Card>
  );
}
