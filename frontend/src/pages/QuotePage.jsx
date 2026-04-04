import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

import { appApi } from "../api/appApi";
import { PremiumExplanationPanel } from "../components/explainability/PremiumExplanationPanel";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";

export function QuotePage() {
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activating, setActivating] = useState(false);

  const loadQuote = async () => {
    setLoading(true);
    const result = await appApi.calculatePremium(user._id);
    setQuote(result.quote);
    setLoading(false);
  };

  useEffect(() => {
    if (user?._id) {
      loadQuote();
    }
  }, [user?._id]);

  const activatePolicy = async () => {
    setActivating(true);
    const created = await appApi.createPolicy({ workerId: user._id });
    const activated = await appApi.activatePolicy(created._id);
    setPolicy(activated);
    setMessage("Weekly policy activated. BlinkShield will now auto-monitor your assigned zone.");
    setActivating(false);
  };

  if (loading) {
    return <Loader label="Generating your weekly quote..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly pricing"
        title="Your BlinkShield quote"
        subtitle="Premiums are computed weekly around your Blinkit zone risk, weather volatility, pollution history, and work regularity."
        actions={<Button variant="secondary" icon={RefreshCw} onClick={loadQuote}>Refresh quote</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Quote card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full p-6" hover={false}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-light">
                <Sparkles size={16} className="text-ocean" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned zone</p>
                <h2 className="text-xl font-extrabold text-ink">{user.assignedZone}</h2>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Badge label={quote.risk_level} tone={quote.risk_level} />
              <span className="text-sm text-slate-500">
                Risk score <span className="font-bold text-ink">{quote.risk_score}</span>
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-[#06141b] to-[#0f2b3a] p-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Weekly premium</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">{formatCurrency(quote.weekly_premium)}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#17a673] to-[#0d9463] p-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Income coverage</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">{formatCurrency(quote.coverage_amount)}</p>
              </div>
            </div>

            <Button
              variant="success"
              icon={ShieldCheck}
              className="mt-6 w-full"
              onClick={activatePolicy}
              disabled={activating}
            >
              {activating ? "Activating..." : "Activate weekly policy"}
            </Button>

            {message ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-surge-light border border-emerald-200 px-4 py-3 text-sm font-medium text-surge"
              >
                <CheckCircle2 size={16} strokeWidth={2.5} />
                {message}
              </motion.div>
            ) : null}
            {policy ? (
              <p className="mt-2 text-xs text-slate-500">
                Policy ends on {new Date(policy.endDate).toLocaleDateString("en-IN")}
              </p>
            ) : null}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PremiumExplanationPanel quote={quote} />
        </motion.div>
      </div>
    </div>
  );
}
