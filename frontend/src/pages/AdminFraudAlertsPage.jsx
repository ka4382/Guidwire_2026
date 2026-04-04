import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Eye } from "lucide-react";

import { appApi } from "../api/appApi";
import { FraudReasonPanel } from "../components/explainability/FraudReasonPanel";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { formatDate } from "../utils/formatters";

export function AdminFraudAlertsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    appApi
      .getAdminFraud()
      .then((result) => {
        setData(result);
        setSelected(result.recentSignals?.[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader label="Loading fraud alerts..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fraud alerts"
        title="Suspicious claims are flagged, not blindly rejected"
        subtitle="BlinkShield keeps fairness central by isolating suspicious telemetry and routing it for review instead of auto-denying borderline workers."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Flagged claims */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" strokeWidth={2.5} />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Flagged claims
              </p>
            </div>
            {data?.flaggedClaims?.length ? (
              <div className="mt-4 space-y-3">
                {data.flaggedClaims.map((claim, i) => (
                  <motion.div
                    key={claim._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl bg-amber-50/50 border border-amber-100 p-4 transition-colors hover:bg-amber-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                          {(claim.workerId?.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{claim.workerId?.name}</p>
                          <p className="text-xs text-slate-500">
                            {formatDate(claim.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge label={`Fraud ${claim.fraudScore}`} tone="flagged" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  icon={ShieldAlert}
                  title="No flagged claims"
                  description="The fraud queue is currently clear."
                />
              </div>
            )}
          </Card>
        </motion.div>

        {/* Signals + explainability */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5" hover={false}>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-ocean" strokeWidth={2.5} />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent fraud signals
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {(data?.recentSignals || []).slice(0, 6).map((signal) => (
                  <button
                    key={signal._id}
                    onClick={() => setSelected(signal)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all ${
                      selected?._id === signal._id
                        ? "bg-gradient-to-br from-[#06141b] to-[#0f2b3a] text-white shadow-lg"
                        : "bg-slate-50 text-ink hover:bg-slate-100"
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      selected?._id === signal._id
                        ? "bg-white/15 text-white"
                        : "bg-white text-ink shadow-subtle"
                    }`}>
                      {(signal.workerId?.name || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{signal.workerId?.name || "Worker"}</p>
                      <p className={`text-xs ${
                        selected?._id === signal._id ? "text-white/60" : "text-slate-500"
                      }`}>
                        {formatDate(signal.recordedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
          <FraudReasonPanel reasons={selected?.flaggedReasons || []} />
        </div>
      </div>
    </div>
  );
}
