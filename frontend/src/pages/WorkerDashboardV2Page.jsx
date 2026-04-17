/**
 * WorkerDashboardV2Page.jsx
 *
 * Phase 3 — Intelligent Worker Dashboard with AI explainability.
 * Shows active policy, premium explanation, claims history, and earnings.
 */

import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  IndianRupee,
  ClipboardList,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";

import { appApi } from "../api/appApi";
import { AuthContext } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { StatTile } from "../components/ui/StatTile";
import { formatCurrency, formatDate, titleCase } from "../utils/formatters";
import { AIInsights } from "../components/explainability/AIInsights";

export function WorkerDashboardV2Page() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    appApi
      .getWorkerDashboardV2(user._id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (loading) return <Loader label="Loading your dashboard..." />;

  const summary = data?.summary || {};
  const claims = data?.claimsSummary || {};
  const recentClaims = data?.recentClaims || [];
  const explanations = data?.premiumExplanation || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Worker intelligence"
        title={`Welcome back, ${user?.name || "Worker"}`}
        subtitle="Your weekly insurance snapshot with AI-powered insights."
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Weekly Premium"
          value={formatCurrency(summary.weeklyPremium)}
          icon={IndianRupee}
          iconBg="bg-[#e8f0fa]"
          iconColor="text-[#0d4c92]"
        />
        <StatTile
          label="Coverage"
          value={formatCurrency(summary.coverageAmount)}
          icon={ShieldCheck}
          iconBg="bg-[#e6f9f1]"
          iconColor="text-[#17a673]"
        />
        <StatTile
          label="Total Claims"
          value={claims.total || 0}
          icon={ClipboardList}
          iconBg="bg-[#fff1eb]"
          iconColor="text-[#ff7849]"
        />
        <StatTile
          label="Earnings Protected"
          value={formatCurrency(summary.totalEarningsProtected)}
          icon={TrendingUp}
          iconBg="bg-[#e6f9f1]"
          iconColor="text-[#17a673]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* AI Premium Explainability */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-ocean" strokeWidth={2.5} />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
                Why this premium?
              </p>
            </div>

            {explanations.length > 0 ? (
              <AIInsights type="premium" explanations={explanations} />
            ) : (
              <p className="text-sm text-slate-400">
                Activate a policy to see AI-powered premium insights.
              </p>
            )}

            {/* Active policy badge */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  label={summary.activePolicyExists ? "Policy active" : "No active policy"}
                  tone={summary.activePolicyExists ? "active" : "inactive"}
                />
              </div>
              {summary.activePolicyExists && summary.policyValidUntil && (
                 <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
                    <div className="flex justify-between mb-1">
                      <span>Valid till:</span>
                      <span className="font-bold text-ink">{new Date(summary.policyValidUntil).toLocaleDateString()}</span>
                    </div>
                    {summary.paymentDetails && (
                      <>
                        <div className="flex justify-between mb-1">
                          <span>Paid via:</span>
                          <span className="font-bold uppercase text-ink">{summary.paymentDetails.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Txn ID:</span>
                          <span className="font-mono text-[10px] bg-white border border-slate-200 px-1 rounded text-ink">{summary.paymentDetails.transactionId}</span>
                        </div>
                      </>
                    )}
                 </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Claims breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
              Claims breakdown
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <CheckCircle2 size={18} className="mx-auto text-emerald-500" />
                <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                  {claims.approved || 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Approved
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <AlertTriangle size={18} className="mx-auto text-amber-500" />
                <p className="mt-2 text-2xl font-extrabold text-amber-700">
                  {claims.flagged || 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  Flagged
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <XCircle size={18} className="mx-auto text-red-500" />
                <p className="mt-2 text-2xl font-extrabold text-red-700">
                  {claims.rejected || 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                  Rejected
                </p>
              </div>
            </div>

            {/* Earnings summary */}
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Avg weekly earnings
                  </p>
                  <p className="text-lg font-extrabold text-ink">
                    {formatCurrency(data?.earningsSummary?.avgWeeklyEarnings)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Avg daily hours
                  </p>
                  <p className="text-lg font-extrabold text-ink">
                    {data?.earningsSummary?.avgDailyHours?.toFixed(1) || "0"}h
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent claims list */}
      {recentClaims.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" hover={false}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
              Recent claims
            </p>
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100"
                >
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {titleCase(claim.decision || claim.claimStatus)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatDate(claim.createdAt)} •{" "}
                      Fraud Score: {Math.round((claim.fraudScore || 0) * 100)}/100
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink">
                      {formatCurrency(claim.payoutAmount)}
                    </p>
                    <Badge
                      label={titleCase(claim.claimStatus)}
                      tone={claim.claimStatus}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
