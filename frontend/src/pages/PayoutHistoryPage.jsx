import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, CheckCircle2, Clock } from "lucide-react";

import { appApi } from "../api/appApi";
import { PayoutTrendChart } from "../components/charts/PayoutTrendChart";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate } from "../utils/formatters";

export function PayoutHistoryPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appApi.getPayouts(user._id).then(setPayouts).finally(() => setLoading(false));
  }, [user?._id]);

  const chartData = useMemo(() => {
    const grouped = payouts.reduce((acc, p) => {
      acc[p.payoutStatus] = (acc[p.payoutStatus] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [payouts]);

  const totalPaid = useMemo(
    () => payouts.reduce((sum, p) => sum + (p.payoutStatus === "completed" ? p.amount : 0), 0),
    [payouts]
  );

  if (loading) {
    return <Loader label="Loading payouts..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payouts"
        title="Protected earning payouts"
        subtitle="BlinkShield pays for income disruption only, based on automated parametric decisions and weekly policy limits."
      />

      {/* Summary strip */}
      {payouts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-surge-light border border-emerald-200 px-5 py-3">
            <Wallet size={20} className="text-surge" strokeWidth={2.5} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-surge/60">Total paid</p>
              <p className="text-xl font-extrabold text-surge">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-3">
            <CheckCircle2 size={20} className="text-slate-500" strokeWidth={2} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transactions</p>
              <p className="text-xl font-extrabold text-ink">{payouts.length}</p>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Payout distribution
            </p>
            {chartData.length ? (
              <PayoutTrendChart data={chartData} />
            ) : (
              <EmptyState
                icon={Wallet}
                title="No payouts yet"
                description="Your payout chart will appear after the first approved claim."
              />
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full p-6" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Payout history
            </p>
            <div className="mt-4 space-y-3">
              {payouts.length ? (
                payouts.map((payout, i) => (
                  <motion.div
                    key={payout._id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${
                          payout.payoutStatus === "completed" ? "bg-surge-light" : "bg-amber-50"
                        }`}>
                          {payout.payoutStatus === "completed" ? (
                            <CheckCircle2 size={16} className="text-surge" strokeWidth={2.5} />
                          ) : (
                            <Clock size={16} className="text-amber-600" strokeWidth={2.5} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{formatCurrency(payout.amount)}</p>
                          <p className="text-xs text-slate-500">{formatDate(payout.processedAt)}</p>
                        </div>
                      </div>
                      <Badge
                        label={payout.payoutStatus}
                        tone={payout.payoutStatus === "completed" ? "paid" : "flagged"}
                      />
                    </div>
                    <p className="mt-2 truncate text-xs text-slate-400 font-mono">
                      {payout.providerReference}
                    </p>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={Wallet}
                  title="No payout records"
                  description="Payouts will appear after an approved claim runs through the execution agent."
                />
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
