import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, XCircle, Clock } from "lucide-react";
import { titleCase } from "../../utils/formatters";

export function DecisionTimeline({ event, claim, fraudExplanation, payout }) {
  const steps = [
    {
      id: "event",
      label: "Disruption Detected",
      status: event ? "success" : "pending",
      value: event ? titleCase(event.type) : "Awaiting...",
      detail: event ? `Zone: ${event.zone}` : "",
      icon: Clock,
    },
    {
      id: "claim",
      label: "Claim Auto-Generated",
      status: claim ? "success" : "pending",
      value: claim ? `ID: ${claim._id?.substring(0, 6)}` : "Pending generation",
      detail: claim ? `Triggered by rules engine` : "",
      icon: Clock,
    },
    {
      id: "fraud",
      label: "Fraud Analysis Running",
      status: fraudExplanation ? "success" : "pending",
      value: fraudExplanation ? `Score: ${fraudExplanation.fraud_score}/100` : "...",
      detail: fraudExplanation ? `Risk: ${fraudExplanation.risk_level}` : "",
      icon: fraudExplanation?.risk_level === "HIGH" ? ShieldAlert : CheckCircle2,
      warn: fraudExplanation?.risk_level === "HIGH"
    },
    {
      id: "decision",
      label: "AI Decision Status",
      status: claim?.decision ? "success" : "pending",
      value: claim ? titleCase(claim.decision) : "...",
      detail: claim?.reasons?.[0] || "",
      icon: claim?.decision === "approved" ? CheckCircle2 : claim?.decision === "rejected" ? XCircle : ShieldAlert,
      warn: claim?.decision !== "approved" && claim?.decision !== undefined
    },
    {
      id: "payout",
      label: "Instant Payout",
      status: payout ? "success" : claim?.decision === "rejected" ? "skipped" : "pending",
      value: payout ? `₹${payout.amount}` : "...",
      detail: payout ? `Ref: ${payout.providerReference}` : "Pending decision",
      icon: CheckCircle2,
    }
  ];

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 py-2 space-y-6">
      {steps.map((step, i) => {
        const isSuccess = step.status === "success";
        const isPending = step.status === "pending";
        const isWarn = step.warn;
        
        let dotColor = "bg-slate-300";
        if (isSuccess && isWarn) dotColor = "bg-amber-500 ring-4 ring-amber-100";
        else if (isSuccess) dotColor = "bg-ocean ring-4 ring-ocean-light";
        
        return (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`relative pl-6 ${isPending ? 'opacity-50 grayscale' : ''}`}
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full ${dotColor}`} />
            
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {step.label}
              </span>
              <span className={`text-base font-extrabold ${isWarn ? 'text-amber-600' : 'text-ink'}`}>
                {step.value}
              </span>
              {step.detail && (
                <span className="text-xs text-slate-500 mt-0.5">{step.detail}</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
