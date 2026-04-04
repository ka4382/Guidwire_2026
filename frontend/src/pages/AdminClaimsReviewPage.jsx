import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileSearch,
  User,
  MapPin,
  Shield,
  Send,
  Filter
} from "lucide-react";

import { appApi } from "../api/appApi";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { formatCurrency, formatDate, titleCase } from "../utils/formatters";

const statusConfig = {
  pending: { tone: "flagged", icon: Clock, label: "Pending Review", color: "text-amber-600", bg: "bg-amber-50" },
  flagged: { tone: "flagged", icon: AlertTriangle, label: "Flagged", color: "text-amber-600", bg: "bg-amber-50" },
  approved: { tone: "approved", icon: CheckCircle2, label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected: { tone: "rejected", icon: XCircle, label: "Rejected", color: "text-red-600", bg: "bg-red-50" },
  created: { tone: "flagged", icon: Clock, label: "Created", color: "text-blue-600", bg: "bg-blue-50" },
  paid: { tone: "approved", icon: CheckCircle2, label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50" }
};

const filterTabs = [
  { id: "review", label: "Needs Review", count: 0 },
  { id: "all", label: "All Claims", count: 0 }
];

export function AdminClaimsReviewPage() {
  const [claims, setClaims] = useState([]);
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("review");

  const loadClaims = useCallback(async () => {
    try {
      const [pending, all] = await Promise.all([
        appApi.getAdminPendingClaims(),
        appApi.getAdminAllClaims()
      ]);
      setClaims(pending);
      setAllClaims(all);
      if (!selected) {
        setSelected(pending[0] || all[0] || null);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const handleReview = async (action) => {
    if (!selected) return;
    setReviewLoading(true);
    try {
      await appApi.reviewClaim(selected._id, { action, notes: reviewNotes });
      setReviewNotes("");
      setSelected(null);
      await loadClaims();
    } catch {
      // handle error
    } finally {
      setReviewLoading(false);
    }
  };

  const displayClaims = activeTab === "review" ? claims : allClaims;

  if (loading) {
    return <Loader label="Loading claims for review..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Claims review"
        title="Verify worker insurance claims"
        subtitle="Review pending and flagged claims filed by delivery partners. Approve legitimate disruption claims or reject fraudulent ones with reasoning."
      />

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {filterTabs.map((tab) => {
          const count = tab.id === "review" ? claims.length : allClaims.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-ink shadow-sm"
                  : "text-slate-500 hover:text-ink"
              }`}
            >
              {tab.id === "review" ? <Filter size={14} /> : <ClipboardCheck size={14} />}
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                activeTab === tab.id ? "bg-[#e6f9f1] text-[#17a673]" : "bg-slate-200 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {!displayClaims.length ? (
        <EmptyState
          icon={ClipboardCheck}
          title={activeTab === "review" ? "No pending claims" : "No claims yet"}
          description={
            activeTab === "review"
              ? "All claims have been reviewed. New claims filed by workers will appear here."
              : "No claims have been filed yet."
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Claims list */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {displayClaims.map((claim, i) => {
                const cfg = statusConfig[claim.claimStatus] || statusConfig.created;
                const StatusIcon = cfg.icon;
                const isActive = selected?._id === claim._id;
                return (
                  <motion.div
                    key={claim._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <button
                      onClick={() => { setSelected(claim); setReviewNotes(""); }}
                      className={`w-full text-left rounded-2xl border p-4 transition-all ${
                        isActive
                          ? "border-[#0d4c92] bg-[#e8f0fa]/50 ring-2 ring-[#0d4c92]/15 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg} text-sm font-bold ${cfg.color}`}>
                            {(claim.workerId?.name || "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-ink">{claim.workerId?.name || "Unknown"}</p>
                            <p className="text-xs text-slate-500">
                              {titleCase(claim.disruptionEventId?.type || "claim")} · {formatDate(claim.createdAt)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {claim.workerId?.assignedZone || "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge label={cfg.label} tone={cfg.tone} />
                          <span className="text-sm font-extrabold text-ink">
                            {formatCurrency(claim.payoutAmount)}
                          </span>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Claim detail panel */}
          <div className="space-y-4">
            {selected ? (
              <>
                <motion.div
                  key={selected._id + "-detail"}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-6" hover={false}>
                    <div className="flex items-center gap-2">
                      <FileSearch size={16} className="text-[#0d4c92]" strokeWidth={2.5} />
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Claim details
                      </p>
                    </div>

                    {/* Worker info */}
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d4c92] to-[#17a673] text-sm font-bold text-white">
                        {(selected.workerId?.name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{selected.workerId?.name}</p>
                        <p className="text-xs text-slate-500">{selected.workerId?.email} · {selected.workerId?.assignedZone}</p>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Disruption type</p>
                        <p className="mt-1 text-sm font-bold text-ink">
                          {titleCase(selected.disruptionEventId?.type || "—")}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Payout amount</p>
                        <p className="mt-1 text-lg font-extrabold text-ink">
                          {formatCurrency(selected.payoutAmount)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Fraud score</p>
                        <p className={`mt-1 text-lg font-bold ${
                          selected.fraudScore >= 0.5 ? "text-red-600" : selected.fraudScore >= 0.3 ? "text-amber-600" : "text-emerald-600"
                        }`}>
                          {selected.fraudScore}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Loss window</p>
                        <p className="mt-1 text-lg font-bold text-ink">{selected.lossWindowHours} hours</p>
                      </div>
                    </div>

                    {/* Evidence / Reasons */}
                    {selected.reasons?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">AI reasoning</p>
                        <div className="mt-2 space-y-1.5">
                          {selected.reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
                              <ChevronRight size={12} className="mt-0.5 shrink-0 text-slate-400" />
                              <p className="text-xs leading-relaxed text-slate-600">{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disruption evidence */}
                    {selected.disruptionEventId?.evidence?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Worker report</p>
                        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3.5">
                          <p className="text-sm text-slate-600 italic">
                            "{selected.disruptionEventId.evidence[0]?.summary}"
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Admin action panel */}
                {(selected.claimStatus === "pending" || selected.claimStatus === "flagged" || selected.claimStatus === "created") && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="p-6" hover={false}>
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-[#17a673]" strokeWidth={2.5} />
                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          Admin decision
                        </p>
                      </div>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add review notes (optional)..."
                        rows={2}
                        className="input-field mt-3 resize-none text-sm"
                      />
                      <div className="mt-4 flex gap-3">
                        <Button
                          onClick={() => handleReview("approve")}
                          disabled={reviewLoading}
                          icon={CheckCircle2}
                          className="flex-1"
                        >
                          {reviewLoading ? "Processing..." : "Approve & pay"}
                        </Button>
                        <button
                          onClick={() => handleReview("reject")}
                          disabled={reviewLoading}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
                        >
                          <XCircle size={16} strokeWidth={2} />
                          Reject claim
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </>
            ) : (
              <Card className="p-8 text-center" hover={false}>
                <FileSearch size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Select a claim from the list to review</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
