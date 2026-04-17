import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  Thermometer,
  Wind,
  MapPin,
  Radio,
  ShieldAlert,
  Megaphone,
  Store,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";

import { appApi } from "../api/appApi";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";

const eventTypes = [
  {
    id: "heavy_rainfall",
    label: "Heavy Rainfall",
    desc: "Rainfall exceeding 50mm disrupting deliveries",
    icon: CloudRain,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-600"
  },
  {
    id: "extreme_heat",
    label: "Extreme Heat",
    desc: "Temperature above 42°C making deliveries unsafe",
    icon: Thermometer,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    activeBg: "bg-orange-600"
  },
  {
    id: "severe_aqi",
    label: "Severe AQI",
    desc: "Air quality index exceeding 300",
    icon: Wind,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBg: "bg-purple-600"
  },
  {
    id: "zone_closure",
    label: "Zone Closure",
    desc: "Dark-store zone temporarily closed",
    icon: MapPin,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    activeBg: "bg-red-600"
  },
  {
    id: "platform_outage",
    label: "Platform Outage",
    desc: "Blinkit platform suspended orders",
    icon: Radio,
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    activeBg: "bg-slate-700"
  },
  {
    id: "unplanned_curfew",
    label: "Unplanned Curfew",
    desc: "Government-enforced sudden curfew in area",
    icon: ShieldAlert,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    activeBg: "bg-rose-600"
  },
  {
    id: "local_strike",
    label: "Local Strike",
    desc: "Labour or transport strike affecting deliveries",
    icon: Megaphone,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-600"
  },
  {
    id: "market_closure",
    label: "Market / Zone Closure",
    desc: "Sudden market shutdown or commercial closure",
    icon: Store,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBg: "bg-emerald-600"
  }
];

export function FileClaimPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || description.length < 5) return;
    setLoading(true);
    setError("");
    try {
      const result = await appApi.fileClaim({
        workerId: user._id,
        eventType: selectedType,
        description,
        zone: user.assignedZone
      });
      setSuccess(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to file claim. Ensure you have an active policy.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Claim filed"
          title="Your claim has been submitted"
          subtitle="Our AI agent has processed your report. An admin will review and verify your claim shortly."
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          <Card className="mx-auto max-w-lg p-8 text-center" hover={false}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f1]">
              <CheckCircle2 size={28} className="text-[#17a673]" strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-ink">Claim submitted successfully</h3>
            <p className="mt-2 text-sm text-slate-500">
              Your claim for <strong>{eventTypes.find(t => t.id === selectedType)?.label}</strong> has been
              received and is pending admin verification.
            </p>
            <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending review</p>
              </div>
              <p className="mt-1 text-sm text-amber-800">
                Fraud score: <strong>{success.fraud?.fraud_score ?? "—"}</strong> · Status: <strong>Pending</strong>
              </p>
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={() => navigate("/claims")} icon={FileText}>
                View my claims
              </Button>
              <Button variant="secondary" onClick={() => { setSuccess(null); setSelectedType(null); setDescription(""); }}>
                File another
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="File a claim"
        title="Report a disruption & claim coverage"
        subtitle="Select the type of disruption that affected your delivery window. BlinkShield's AI will process your claim and route it for admin verification."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event type selection */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#0d4c92]" strokeWidth={2.5} />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Select disruption type
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {eventTypes.map((evt) => {
                const Icon = evt.icon;
                const isSelected = selectedType === evt.id;
                return (
                  <motion.button
                    key={evt.id}
                    type="button"
                    onClick={() => setSelectedType(evt.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? `${evt.border} ${evt.bg} ring-2 ring-${evt.activeBg}/20 shadow-md`
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="claim-check"
                        className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full ${evt.activeBg} text-white`}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      >
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </motion.div>
                    )}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? evt.bg : "bg-slate-50"} transition-colors`}>
                      <Icon
                        size={20}
                        className={`${isSelected ? evt.color : "text-slate-400"} transition-colors`}
                        strokeWidth={2}
                      />
                    </div>
                    <h4 className={`mt-2.5 text-sm font-bold ${isSelected ? "text-ink" : "text-slate-600"}`}>
                      {evt.label}
                    </h4>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{evt.desc}</p>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0d4c92]" strokeWidth={2.5} />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Describe what happened
            </p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the disruption in your own words — e.g. 'Heavy rainfall since 2pm, roads waterlogged in Koramangala area, unable to complete any deliveries for 4 hours...'"
            rows={4}
            className="input-field mt-4 resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Minimum 5 characters</p>
            <p className={`text-[11px] ${description.length >= 5 ? "text-[#17a673]" : "text-slate-400"}`}>
              {description.length} characters
            </p>
          </div>
        </Card>

        {/* Complaint / Evidence Upload */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Radio size={16} className="text-[#0d4c92]" strokeWidth={2.5} />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Provide Evidence
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-dashed border-slate-300 bg-slate-50 p-4 rounded-xl text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-600">Upload Image</span>
              <p className="mt-1 text-xs text-slate-400">Screenshot or photo (Optional)</p>
            </div>
            <div className="border border-dashed border-slate-300 bg-slate-50 p-4 rounded-xl text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-600">Upload Video</span>
              <p className="mt-1 text-xs text-slate-400">Under 30s (Optional)</p>
            </div>
          </div>
        </Card>

        {/* Summary + Submit */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Claim summary</p>
              <p className="mt-1 text-sm text-slate-600">
                Zone: <strong>{user?.assignedZone || "—"}</strong> ·
                Type: <strong>{eventTypes.find(t => t.id === selectedType)?.label || "Not selected"}</strong>
              </p>
            </div>
            <Button
              type="submit"
              icon={Send}
              disabled={!selectedType || description.length < 5 || loading}
            >
              {loading ? "Processing claim..." : "Submit claim"}
            </Button>
          </div>
          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 flex items-center gap-2">
              <AlertTriangle size={16} />
              {error.includes("active policy") ? "⚠️ Please activate a policy to claim protection" : error}
            </div>
          )}
        </Card>
      </form>
    </div>
  );
}
