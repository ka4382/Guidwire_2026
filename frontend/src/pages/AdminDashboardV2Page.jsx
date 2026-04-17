/**
 * AdminDashboardV2Page.jsx
 *
 * Phase 3 — Intelligent Admin Dashboard with fraud analytics,
 * high-risk zones, and predicted next-week risk.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ClipboardList,
  Percent,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Info,
  Users
} from "lucide-react";

import { appApi } from "../api/appApi";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { StatTile } from "../components/ui/StatTile";
import { formatCurrency, formatDate, titleCase } from "../utils/formatters";
import { RiskZoneMap } from "../components/explainability/RiskZoneMap";

export function AdminDashboardV2Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appApi
      .getAdminDashboardV2()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading admin dashboard..." />;

  const overview = data?.overview || {};
  const totals = overview?.totals || {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin intelligence"
        title="Phase 3 — Risk & Fraud Console"
        subtitle="AI-powered overview of claims, fraud signals, high-risk zones, and next-week predictions."
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatTile
          label="Total Claims"
          value={data?.total_claims || 0}
          icon={ClipboardList}
          iconBg="bg-[#fff1eb]"
          iconColor="text-[#ff7849]"
        />
        <StatTile
          label="Fraud Flagged"
          value={data?.fraud_flagged_count || 0}
          icon={ShieldAlert}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <StatTile
          label="Approval Rate"
          value={`${data?.approval_rate || 0}%`}
          icon={Percent}
          iconBg="bg-[#e6f9f1]"
          iconColor="text-[#17a673]"
        />
        <StatTile
          label="Workers"
          value={totals?.totalWorkers || 0}
          icon={Users}
          iconBg="bg-[#e8f0fa]"
          iconColor="text-[#0d4c92]"
        />
        <StatTile
          label="Next Week Risk"
          value={`${data?.predicted_next_week_risk || 0}%`}
          icon={TrendingUp}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* High-Risk Zones */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-red-500" strokeWidth={2.5} />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Predictive High-Risk Zones
              </p>
            </div>
            
            <RiskZoneMap 
              zones={data?.predictions?.map(p => ({
                 zone: p.zone,
                 likelyTrigger: p.reason,
                 predictedRisk: p.confidence_score || 50
              })) || []} 
            />

          </Card>
        </motion.div>

        {/* Why claims flagged — AI Explainability */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-ocean" strokeWidth={2.5} />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
                Why claims flagged?
              </p>
            </div>

            {data?.recentFraudSignals?.length > 0 ? (
              <div className="space-y-3">
                {data.recentFraudSignals.map((signal, i) => {
                  const score = Math.round((signal.anomalyScore || 0) * 100);
                  const riskLevel =
                    score >= 78 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW";

                  return (
                    <div
                      key={signal._id || i}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            size={14}
                            className={
                              riskLevel === "HIGH"
                                ? "text-red-500"
                                : riskLevel === "MEDIUM"
                                  ? "text-amber-500"
                                  : "text-slate-400"
                            }
                          />
                          <p className="text-sm font-bold text-ink">
                            {signal.workerId?.name || "Worker"}
                          </p>
                        </div>
                        <Badge
                          label={`${score}/100`}
                          tone={
                            riskLevel === "HIGH"
                              ? "critical"
                              : riskLevel === "MEDIUM"
                                ? "medium"
                                : "low"
                          }
                        />
                      </div>

                      {signal.flaggedReasons?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {signal.flaggedReasons.slice(0, 2).map((reason, j) => (
                            <p
                              key={j}
                              className="text-xs text-slate-500 flex items-start gap-1.5"
                            >
                              <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                              {reason}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Feature bars */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            GPS Stability
                          </p>
                          <div className="mt-1 h-1 w-full rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-ocean"
                              style={{
                                width: `${(signal.gpsStabilityScore || 0) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            Activity Match
                          </p>
                          <div className="mt-1 h-1 w-full rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-surge"
                              style={{
                                width: `${(signal.activityMatch || 0) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No fraud signals detected yet.
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Overview stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6" hover={false}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Financial overview
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Active Policies
              </p>
              <p className="mt-2 text-2xl font-extrabold text-ink">
                {totals?.activePolicies || 0}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                Total Paid
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                {formatCurrency(totals?.paidAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Loss Ratio
              </p>
              <p className="mt-2 text-2xl font-extrabold text-ink">
                {Math.round((totals?.lossRatio || 0) * 100)}%
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
