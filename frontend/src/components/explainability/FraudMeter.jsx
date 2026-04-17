import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";

export function FraudMeter({ score = 0, riskLevel = "LOW" }) {
  // Map score (0-100) to semi-circle degrees (0-180)
  const rotation = (score / 100) * 180;
  
  let color = "#10b981"; // Emerald
  let badgeTone = "low";
  if (riskLevel === "HIGH") {
    color = "#ef4444"; // Red
    badgeTone = "critical";
  } else if (riskLevel === "MEDIUM") {
    color = "#f59e0b"; // Amber
    badgeTone = "medium";
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-48 overflow-hidden">
        {/* Background track */}
        <div className="absolute inset-0 rounded-t-full border-[8px] border-slate-100" />
        
        {/* Fill track mapping the score */}
        <motion.div
           initial={{ rotate: -180 }}
           animate={{ rotate: rotation - 180 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute inset-0 rounded-t-full border-[8px] border-transparent"
           style={{
             borderTopColor: color,
             borderRightColor: color,
             transformOrigin: "bottom center"
           }}
        />
        
        {/* Value overlay */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-3xl font-extrabold" style={{ color }}>{score}</p>
        </div>
      </div>
      <div className="mt-3">
        <Badge label={`${riskLevel} RISK`} tone={badgeTone} />
      </div>
    </div>
  );
}
