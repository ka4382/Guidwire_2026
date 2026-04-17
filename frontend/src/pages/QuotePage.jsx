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

import { PaymentModal } from "../components/ui/PaymentModal";

export function QuotePage() {
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activating, setActivating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState("standard");

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

  const handlePaymentSuccess = async (method) => {
    setActivating(true);
    try {
      // Pass tier logic if the backend policy supports tier saving, otherwise it uses quote base
      const created = await appApi.createPolicy({ workerId: user._id, tier: selectedTier });
      const paymentResponse = await appApi.simulatePayment({
        policyId: created._id,
        method: method
      });
      setPolicy(paymentResponse.data);
      setMessage(paymentResponse.data.message || "Weekly policy activated. BlinkShield will now auto-monitor your assigned zone.");
      setTimeout(() => {
        setShowPayment(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setMessage("Failed to activate policy via payment mock.");
    } finally {
      setActivating(false);
    }
  };

  if (loading || !quote) {
    return <Loader label="Generating your weekly quote..." />;
  }

  const activePlan = quote.plans?.[selectedTier] || {
    weekly_premium: quote.weekly_premium,
    coverage_amount: quote.coverage_amount
  };

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

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              {['lite', 'standard', 'premium'].map((tier) => {
                const planData = quote.plans?.[tier] || {
                  weekly_premium: quote.weekly_premium,
                  coverage_amount: quote.coverage_amount,
                  label: tier === 'lite' ? 'Lite' : tier === 'standard' ? 'Standard' : 'Premium',
                };
                
                const isSelected = selectedTier === tier;
                
                return (
                  <div 
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`flex-1 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                      isSelected ? 'border-ocean bg-ocean/5' : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                       <p className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-ocean' : 'text-slate-500'}`}>
                         {planData.label}
                       </p>
                       {isSelected && <CheckCircle2 size={14} className="text-ocean" />}
                    </div>
                    <p className={`text-2xl font-extrabold tracking-tight ${isSelected ? 'text-ocean-dark' : 'text-ink'}`}>
                      {formatCurrency(planData.weekly_premium)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-emerald-600">
                      Covers {formatCurrency(planData.coverage_amount)}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 rounded-xl bg-orange-50 p-4 border border-orange-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                Risk Assesment
              </p>
              <p className="text-sm font-medium text-orange-800">
                If bad weather occurs, you may lose <span className="font-bold">₹600</span> in earnings.<br/>
                Your {" "}<span className="font-bold">{formatCurrency(activePlan.weekly_premium)}</span>{" "} coverage protects up to {" "}<span className="font-bold">{formatCurrency(activePlan.coverage_amount)}</span>.
              </p>
            </div>

            <Button
              variant="success"
              icon={ShieldCheck}
              className="mt-6 w-full"
              onClick={() => setShowPayment(true)}
              disabled={activating}
            >
              {activating ? "Activating..." : "Activate weekly policy"}
            </Button>

            <PaymentModal 
              isOpen={showPayment}
              premiumAmount={activePlan.weekly_premium}
              coverageAmount={activePlan.coverage_amount}
              onClose={() => setShowPayment(false)}
              onSuccess={handlePaymentSuccess}
            />

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
                Policy ends on {new Date(policy.endDate || policy.validUntil).toLocaleDateString("en-IN")}
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
