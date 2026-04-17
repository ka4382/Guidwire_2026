/**
 * DemoPage.jsx
 *
 * Phase 3 — Full-featured demo simulation page with Live API Toggle.
 */

import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  Wind,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Banknote,
  Loader2,
  Info,
  Zap,
  Globe,
  Database
} from "lucide-react";

import { appApi } from "../api/appApi";
import { AuthContext } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { formatCurrency, formatDate, titleCase } from "../utils/formatters";

// Phase 3 Extend
import { FraudMeter } from "../components/explainability/FraudMeter";
import { ImpactCard } from "../components/explainability/ImpactCard";
import { DecisionTimeline } from "../components/explainability/DecisionTimeline";
import { AIInsights } from "../components/explainability/AIInsights";


const SIMULATIONS = [
  {
    id: "rain",
    label: "Simulate Rain",
    emoji: "🌧️",
    icon: CloudRain,
    description: "Heavy rainfall disruption in Koramangala",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    api: (zone, useRealApi) => appApi.simulateRain(zone, useRealApi)
  },
  {
    id: "pollution",
    label: "Simulate Pollution",
    emoji: "🌫️",
    icon: Wind,
    description: "Severe AQI disruption exceeding threshold",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-700",
    api: (zone, useRealApi) => appApi.simulatePollution(zone, useRealApi)
  },
  {
    id: "fraud",
    label: "Simulate Fraud",
    emoji: "🚨",
    icon: AlertTriangle,
    description: "GPS spoof attack detection scenario",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    border: "border-red-200",
    textColor: "text-red-700",
    api: (zone, useRealApi) => appApi.simulateFraud(zone, useRealApi)
  }
];


function ClaimResultCard({ result, event }) {
  if (!result) return null;

  const claim = result.claim;
  const fraudExplanation = result.fraudExplanation;
  const payout = result.payout;

  const decisionTone =
    claim?.decision === "approved"
      ? "approved"
      : claim?.decision === "flagged"
        ? "flagged"
        : "rejected";

  const decisionIcon =
    claim?.decision === "approved"
      ? CheckCircle2
      : claim?.decision === "flagged"
        ? ShieldAlert
        : XCircle;

  const DecisionIcon = decisionIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-5" hover={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DecisionIcon
              size={18}
              className={
                claim?.decision === "approved"
                  ? "text-emerald-500"
                  : claim?.decision === "flagged"
                    ? "text-amber-500"
                    : "text-red-500"
              }
            />
            <p className="text-sm font-bold text-ink">
              {result.workerName || "Worker"}
            </p>
          </div>
          <Badge label={titleCase(claim?.decision || "pending")} tone={decisionTone} />
        </div>

        {/* Phase 3 UX: Grid Breakdown */}
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
            
            {/* Column 1: AI Timeline */}
            <div className="col-span-1 rounded-xl bg-slate-50 p-4 border border-slate-100">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Decision Timeline
               </p>
               <DecisionTimeline event={event} claim={claim} fraudExplanation={fraudExplanation} payout={payout} />
            </div>

            {/* Column 2: Context & Fraud */}
            <div className="col-span-1 flex flex-col gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex-1 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-full text-left mb-2">
                        Fraud Model
                    </p>
                    <FraudMeter 
                        score={fraudExplanation?.fraud_score ?? Math.round((claim?.fraudScore || 0) * 100)} 
                        riskLevel={fraudExplanation?.risk_level || (claim?.fraudScore > 0.45 ? "MEDIUM" : "LOW")} 
                    />
                </div>
            </div>

            {/* Column 3: Impact */}
            <div className="col-span-1 flex flex-col gap-4">
                <ImpactCard lossAmount={600} payoutAmount={claim?.payoutAmount || 0} />
            </div>

        </div>

        {/* Phase 3 AI Insights Wrapper */}
        <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Explainable AI Insights
            </p>
            <div className="grid gap-3 lg:grid-cols-2">
                {fraudExplanation && (
                    <AIInsights 
                        type="claim"
                        riskLevel={fraudExplanation.risk_level}
                        reasons={[fraudExplanation.explanation, ...(fraudExplanation.reasons || []).map(r => r.label)]}
                    />
                )}
                {claim?.reasons?.length > 0 && (
                    <AIInsights 
                        type="claim"
                        riskLevel={claim.decision === 'rejected' ? 'HIGH' : claim.decision === 'flagged' ? 'MEDIUM' : 'LOW'}
                        reasons={claim.reasons}
                    />
                )}
            </div>
        </div>

        {/* Payout info */}
        {payout && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <div className="flex items-center gap-2">
               <Banknote size={16} className="shrink-0 text-emerald-600" />
               <p className="text-sm font-medium text-emerald-700">
                 Payout processed via {payout.provider || "UPI (Mock)"}
               </p>
            </div>
            <p className="text-sm font-bold text-emerald-700">Ref: {payout.providerReference}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export function DemoPage() {
  const { user } = useContext(AuthContext);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [useRealApi, setUseRealApi] = useState(false); // Toggle state

  const runSimulation = async (sim) => {
    setActiveSimulation(sim.id);
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await sim.api("Koramangala-5th-Block", useRealApi);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
          <PageHeader
            eyebrow="Phase 3 demo"
            title="One-click simulation engine"
            subtitle="Trigger disruption → auto claim → fraud analysis → instant payout. All visible in real-time."
          />
          
          {/* Phase 3 Toggle Component */}
          <div className="hidden sm:flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm items-center">
             <button
               onClick={() => setUseRealApi(false)}
               className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                 !useRealApi ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
               }`}
             >
               <Database size={14} /> Local Demo Config
             </button>
             <button
               onClick={() => setUseRealApi(true)}
               className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                 useRealApi ? 'bg-ocean text-white shadow-md' : 'text-slate-500 hover:text-ocean'
               }`}
             >
               <Globe size={14} /> Live Weather API
             </button>
          </div>
      </div>

      {/* Simulation buttons */}
      <div className="grid gap-4 sm:grid-cols-3">
        {SIMULATIONS.map((sim) => {
          const Icon = sim.icon;
          const isActive = activeSimulation === sim.id && loading;
          return (
            <motion.button
              key={sim.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => runSimulation(sim)}
              disabled={loading}
              className={`group relative overflow-hidden rounded-2xl border ${sim.border} ${sim.bg} p-5 text-left transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sim.color} text-white shadow-md`}
                >
                  {isActive ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${sim.textColor}`}>
                    {sim.emoji} {sim.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{sim.description}</p>
                </div>
              </div>
              {!loading && (
                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Play size={10} /> Click to trigger
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700"
          >
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-12"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-ocean" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Running full pipeline using {useRealApi ? "Live API" : "Mock Data"}...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Disruption → Claim → Fraud Check → Payout
          </p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Event summary */}
            <Card className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-ocean" strokeWidth={2.5} />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
                      Pipeline result
                    </p>
                  </div>
                  {result.summary?.processingTimeMs && (
                      <Badge label={`⚡ Processed in ${result.summary.processingTimeMs / 1000}s`} tone="created" />
                  )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Disruption
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-ink">
                    {titleCase(result.event?.type || "unknown")}
                  </p>
                  <p className="text-xs text-slate-500">
                    Zone: {result.event?.zone}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    Approved
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-emerald-700">
                    {result.summary?.approved || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                    Flagged
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-amber-700">
                    {result.summary?.flagged || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                    Rejected
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-red-700">
                    {result.summary?.rejected || 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>
                  {result.affectedWorkers} worker(s) evaluated • Total payout:{" "}
                  {formatCurrency(result.summary?.totalPayout)}
                </span>
              </div>
            </Card>

            {/* Per-worker claim cards */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Worker-level results
              </p>
              {result.claims?.map((claimResult, index) => (
                <ClaimResultCard key={index} result={claimResult} event={result.event} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
