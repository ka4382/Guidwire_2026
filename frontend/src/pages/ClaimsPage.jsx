import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, FileSearch } from "lucide-react";

import { appApi } from "../api/appApi";
import { ClaimReasonPanel } from "../components/explainability/ClaimReasonPanel";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate, titleCase } from "../utils/formatters";

export function ClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    appApi
      .getClaims(user._id)
      .then((data) => {
        setClaims(data);
        setSelected(data[0] || null);
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (loading) {
    return <Loader label="Loading claim history..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Claims"
        title="Zero-touch claim outcomes"
        subtitle="BlinkShield auto-creates claims whenever a valid parametric trigger affects your assigned Blinkit zone."
      />
      {!claims.length ? (
        <EmptyState
          icon={ClipboardList}
          title="No claims yet"
          description="Run a demo disruption from the admin panel to see the full automated chain."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {claims.map((claim, i) => (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card
                  className={`cursor-pointer p-5 transition-all ${
                    selected?._id === claim._id
                      ? "ring-2 ring-surge shadow-glow"
                      : "hover:shadow-lift"
                  }`}
                  onClick={() => setSelected(claim)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-xl p-2.5 ${
                        claim.claimStatus === "approved" || claim.claimStatus === "paid"
                          ? "bg-surge-light"
                          : claim.claimStatus === "flagged" || claim.claimStatus === "pending"
                          ? "bg-amber-50"
                          : "bg-red-50"
                      }`}>
                        <ClipboardList
                          size={16}
                          className={
                            claim.claimStatus === "approved" || claim.claimStatus === "paid"
                              ? "text-surge"
                              : claim.claimStatus === "flagged" || claim.claimStatus === "pending"
                              ? "text-amber-600"
                              : "text-red-600"
                          }
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          {titleCase(claim.disruptionEventId?.type || "claim")}
                        </p>
                        <h3 className="mt-0.5 text-xl font-extrabold tracking-tight text-ink">
                          {formatCurrency(claim.payoutAmount)}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(claim.createdAt)}</p>
                      </div>
                    </div>
                    <Badge label={claim.claimStatus} tone={claim.claimStatus} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Selected claim detail */}
          <div className="space-y-4">
            <motion.div
              key={selected?._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-6" hover={false}>
                <div className="flex items-center gap-2">
                  <FileSearch size={16} className="text-ocean" strokeWidth={2.5} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Claim details
                  </p>
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-ink">
                  {titleCase(selected?.decision)}
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Fraud score</p>
                    <p className="mt-1 text-lg font-bold text-ink">{selected?.fraudScore}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Loss window</p>
                    <p className="mt-1 text-lg font-bold text-ink">{selected?.lossWindowHours} hours</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            <ClaimReasonPanel claim={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
