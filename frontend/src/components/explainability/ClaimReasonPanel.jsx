import { Card } from "../ui/Card";
import { Scale, CheckCircle2 } from "lucide-react";

export function ClaimReasonPanel({ claim }) {
  if (!claim) return null;

  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center gap-2">
        <Scale size={16} className="text-ocean" strokeWidth={2.5} />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
          Claim reasoning
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {(claim.reasons || []).map((reason, i) => (
          <div
            key={reason}
            className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600 transition-colors hover:bg-slate-100"
          >
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-surge" strokeWidth={2.5} />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
