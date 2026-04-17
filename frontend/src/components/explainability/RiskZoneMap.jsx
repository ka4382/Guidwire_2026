import { MapPin } from "lucide-react";
import { Badge } from "../ui/Badge";
import { titleCase } from "../../utils/formatters";

export function RiskZoneMap({ zones = [] }) {
  if (!zones || zones.length === 0) {
    return <p className="text-sm text-slate-400">No zone data available.</p>;
  }

  return (
    <div className="space-y-3">
      {zones.map((zone, i) => (
        <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${zone.predictedRisk > 70 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              <MapPin size={16} />
            </div>
            <div>
              <p className="font-bold text-ink">{zone.zone}</p>
              <p className="text-[11px] text-slate-500">{titleCase(zone.likelyTrigger || 'general_risk')}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              label={`${zone.predictedRisk}% RISK`} 
              tone={zone.predictedRisk > 70 ? "critical" : "medium"} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
