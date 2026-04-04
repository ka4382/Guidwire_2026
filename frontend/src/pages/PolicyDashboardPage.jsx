import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, AlertTriangle, IndianRupee, TrendingUp } from "lucide-react";

import { appApi } from "../api/appApi";
import { ProtectedEarningsChart } from "../components/charts/ProtectedEarningsChart";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { StatTile } from "../components/ui/StatTile";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate } from "../utils/formatters";

export function PolicyDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    Promise.all([
      appApi.getWorkerAnalytics(user._id),
      appApi.getPolicies(user._id)
    ])
      .then(([analyticsResult, policiesResult]) => {
        setAnalytics(analyticsResult);
        setPolicies(policiesResult);
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  const chartData = useMemo(
    () =>
      (analytics?.recentClaims || []).map((claim, index) => ({
        label: `Claim ${index + 1}`,
        amount: claim.payoutAmount || 0
      })),
    [analytics]
  );

  if (loading) {
    return <Loader label="Loading your BlinkShield dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Worker dashboard"
        title={`Protected income for ${user.assignedZone}`}
        subtitle="BlinkShield focuses only on income loss during disruptions that reduce your Blinkit delivery time."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Protected earnings"
          value={formatCurrency(analytics?.protectedEarnings)}
          icon={IndianRupee}
          iconBg="bg-[#e6f9f1]"
          iconColor="text-[#17a673]"
        />
        <StatTile
          label="Claims approved"
          value={analytics?.claimsSummary?.approved || 0}
          icon={CheckCircle2}
          iconBg="bg-[#e8f0fa]"
          iconColor="text-[#0d4c92]"
        />
        <StatTile
          label="Claims flagged"
          value={analytics?.claimsSummary?.flagged || 0}
          icon={AlertTriangle}
          iconBg="bg-[#fff1eb]"
          iconColor="text-[#ff7849]"
        />
        <StatTile
          label="Avg weekly earnings"
          value={formatCurrency(analytics?.earningsSummary?.avgWeeklyEarnings)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active policy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active policy</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
                  {formatCurrency(analytics?.activePolicy?.weeklyPremium || 0)}
                  <span className="ml-1 text-base font-medium text-slate-400">/ week</span>
                </h2>
              </div>
              <Badge
                label={analytics?.activePolicy?.isActive ? "active" : "inactive"}
                tone={analytics?.activePolicy?.isActive ? "active" : "inactive"}
              />
            </div>
            {analytics?.activePolicy ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-surge-light px-4 py-3">
                  <ShieldCheck size={18} className="text-surge" strokeWidth={2.5} />
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Coverage: {formatCurrency(analytics.activePolicy.coverageAmount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Ends {formatDate(analytics.activePolicy.endDate)}
                    </p>
                  </div>
                </div>
                {analytics.activePolicy.explanation ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                    {analytics.activePolicy.explanation}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="No active policy"
                  description="Create a weekly quote and activate coverage to unlock zero-touch claims."
                />
              </div>
            )}
          </Card>
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Protected earnings history
            </p>
            {chartData.length ? (
              <div className="mt-4">
                <ProtectedEarningsChart data={chartData} />
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="No payouts yet"
                  description="Run the demo simulation from the admin dashboard to see automated claims and payouts."
                />
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Policies table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6" hover={false}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Weekly policies
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 font-semibold text-slate-500">Premium</th>
                  <th className="pb-3 font-semibold text-slate-500">Coverage</th>
                  <th className="pb-3 font-semibold text-slate-500">Risk</th>
                  <th className="pb-3 font-semibold text-slate-500">Start</th>
                  <th className="pb-3 font-semibold text-slate-500">End</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy._id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/50">
                    <td className="py-3.5 font-semibold text-ink">{formatCurrency(policy.weeklyPremium)}</td>
                    <td className="py-3.5">{formatCurrency(policy.coverageAmount)}</td>
                    <td className="py-3.5">
                      <Badge label={policy.riskLevel} tone={policy.riskLevel} />
                    </td>
                    <td className="py-3.5 text-slate-500">{formatDate(policy.startDate)}</td>
                    <td className="py-3.5 text-slate-500">{formatDate(policy.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!policies.length ? (
              <div className="py-4">
                <EmptyState title="No policies yet" description="Activate your first weekly policy from the Quote page." />
              </div>
            ) : null}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
