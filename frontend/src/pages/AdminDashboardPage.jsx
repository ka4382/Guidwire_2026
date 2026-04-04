import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  ClipboardList,
  IndianRupee,
  Percent,
  TrendingUp
} from "lucide-react";

import { appApi } from "../api/appApi";
import { ClaimsFunnelChart } from "../components/charts/ClaimsFunnelChart";
import { DisruptionTrendChart } from "../components/charts/DisruptionTrendChart";
import { DemoSimulator } from "../components/demo/DemoSimulator";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { StatTile } from "../components/ui/StatTile";
import { formatCurrency, titleCase } from "../utils/formatters";

export function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [disruptions, setDisruptions] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([appApi.getAdminOverview(), appApi.getAdminDisruptions()]).then(
      ([overviewResult, disruptionsResult]) => {
        setOverview(overviewResult);
        setDisruptions(disruptionsResult);
      }
    );

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader label="Loading admin analytics..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin intelligence"
        title="BlinkShield insurer console"
        subtitle="Track protected workers, live claims funnel, fraud posture, and next-week disruption signals at the dark-store level."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Workers" value={overview?.totals?.totalWorkers || 0} icon={Users} iconBg="bg-[#e8f0fa]" iconColor="text-[#0d4c92]" />
        <StatTile label="Active policies" value={overview?.totals?.activePolicies || 0} icon={ShieldCheck} iconBg="bg-[#e6f9f1]" iconColor="text-[#17a673]" />
        <StatTile label="Claims" value={overview?.totals?.totalClaims || 0} icon={ClipboardList} iconBg="bg-[#fff1eb]" iconColor="text-[#ff7849]" />
        <StatTile label="Paid amount" value={formatCurrency(overview?.totals?.paidAmount)} icon={IndianRupee} iconBg="bg-[#e6f9f1]" iconColor="text-[#17a673]" />
        <StatTile
          label="Loss ratio"
          value={`${Math.round((overview?.totals?.lossRatio || 0) * 100)}%`}
          icon={Percent}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Claims funnel</p>
            <ClaimsFunnelChart data={overview?.claimsByDecision || []} />
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <DemoSimulator onSimulated={load} />
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Disruptions by zone
            </p>
            <DisruptionTrendChart data={disruptions?.byZone || []} />
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-ocean" strokeWidth={2.5} />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Predicted next-week hotspots
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {overview?.nextWeekTrend?.map((trend) => (
                <div
                  key={`${trend.zone}-${trend.likelyTrigger}`}
                  className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink">{trend.zone}</p>
                      <p className="text-xs text-slate-500">{titleCase(trend.likelyTrigger)}</p>
                    </div>
                    <Badge
                      label={`${trend.predictedRisk}% risk`}
                      tone={trend.predictedRisk > 70 ? "critical" : "medium"}
                    />
                  </div>

                  {/* Risk bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        trend.predictedRisk > 70 ? "bg-red-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${trend.predictedRisk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
