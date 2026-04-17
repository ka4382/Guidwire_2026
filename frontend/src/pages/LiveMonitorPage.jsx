import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio, AlertTriangle, CheckCircle2, CloudRain } from "lucide-react";

import { appApi } from "../api/appApi";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { formatDate, titleCase } from "../utils/formatters";

const disruptionIcons = {
  heavy_rainfall: CloudRain,
  extreme_heat: AlertTriangle,
  severe_pollution: AlertTriangle,
  zone_restriction: AlertTriangle,
  platform_outage: AlertTriangle
};

export function LiveMonitorPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const zone = user?.role === "worker" ? user.assignedZone : undefined;
    appApi.getLiveDisruptions(zone).then(setData).finally(() => setLoading(false));
  }, [user?.assignedZone, user?.role]);

  if (loading) {
    return <Loader label="Scanning live disruption feeds..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live monitoring"
        title="Hyperlocal disruption monitor"
        subtitle="BlinkShield watches rainfall, heat, AQI, dark-store closures, and locality outages at the Blinkit micro-zone level."
        actions={
          <div className="flex items-center gap-2 rounded-full bg-surge-light px-4 py-2">
            <span className="live-dot" />
            <span className="text-xs font-bold text-surge">LIVE DATA (Open-Meteo)</span>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {(data?.monitoredZones || []).map((item, i) => {
          const DIcon = disruptionIcons[item.disruption_type?.replace(/-/g, "_")] || AlertTriangle;
          return (
            <motion.div
              key={item.affected_zone}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2.5 ${item.trigger_status ? "bg-ember-light" : "bg-slate-100"}`}>
                      <DIcon size={18} className={item.trigger_status ? "text-ember" : "text-slate-400"} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{item.affected_zone}</p>
                      <h2 className="mt-1 text-lg font-extrabold text-ink">
                        {titleCase(item.disruption_type)}
                      </h2>
                    </div>
                  </div>
                  <Badge label={item.severity} tone={item.severity} />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {item.trigger_status ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ember-light px-3 py-1 text-xs font-semibold text-ember">
                      <AlertTriangle size={12} /> Active parametric event
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surge-light px-3 py-1 text-xs font-semibold text-surge">
                      <CheckCircle2 size={12} /> Clear zone
                    </span>
                  )}
                </div>

                {item.evidence?.map((entry) => (
                  <div
                    key={entry.summary}
                    className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600"
                  >
                    {entry.summary}
                  </div>
                ))}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active stored events */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-ocean" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active stored events
            </p>
          </div>
          {data?.activeEvents?.length ? (
            <div className="mt-4 space-y-3">
              {data.activeEvents.map((event) => (
                <div key={event._id} className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink">{titleCase(event.type)}</p>
                      <p className="text-xs text-slate-500">{event.zone}</p>
                    </div>
                    <Badge label={event.severity} tone={event.severity} />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                    <span>
                      Observed <strong className="text-ink">{event.observedValue}</strong> vs trigger{" "}
                      <strong className="text-ink">{event.thresholdValue}</strong>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Started {formatDate(event.startedAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={Radio}
                title="No active disruptions"
                description="The live feed is clear. Use admin demo mode to simulate a trigger."
              />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
