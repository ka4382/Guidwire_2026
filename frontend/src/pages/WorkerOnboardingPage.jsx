import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bike, IndianRupee, Clock, Sun, Activity, CheckCircle2, Save } from "lucide-react";

import { appApi } from "../api/appApi";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";

const vehicleOptions = [
  { value: "bike", label: "🏍️ Bike" },
  { value: "cycle", label: "🚲 Cycle" },
  { value: "ev-scooter", label: "⚡ EV Scooter" }
];

const shiftOptions = [
  { value: "morning-peak", label: "☀️ Morning Peak (7am-11am)" },
  { value: "afternoon", label: "🌤️ Afternoon (11am-4pm)" },
  { value: "evening-peak", label: "🌙 Evening Peak (5pm-10pm)" },
  { value: "peak-mixed", label: "⏰ Peak Mixed (Both peaks)" },
  { value: "all-day", label: "📅 Full Day" }
];

function FieldGroup({ label, icon: Icon, id, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {Icon ? <Icon size={13} strokeWidth={2.5} /> : null}
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function WorkerOnboardingPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    vehicleType: "bike",
    avgWeeklyEarnings: 4200,
    avgDailyHours: 8,
    preferredShift: "morning-peak",
    activityScore: 0.82
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    appApi
      .getWorker(user._id)
      .then((data) => {
        if (data.profile) {
          setForm({
            vehicleType: data.profile.vehicleType || "bike",
            avgWeeklyEarnings: data.profile.avgWeeklyEarnings || 4200,
            avgDailyHours: data.profile.avgDailyHours || 8,
            preferredShift: data.profile.preferredShift || "morning-peak",
            activityScore: data.profile.activityScore || 0.82
          });
        }
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    await appApi.updateWorker(user._id, form);
    await refreshUser();
    setMessage("Onboarding profile updated. You are ready to generate a weekly quote.");
    setSaving(false);
  };

  if (loading) {
    return <Loader label="Loading worker onboarding..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Worker setup"
        title="Complete your protection profile"
        subtitle="BlinkShield uses this to estimate realistic weekly income loss cover for your assigned dark-store zone."
      />
      <Card className="p-6" hover={false}>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Vehicle Type" icon={Bike} id="onb-vehicle" hint="Your primary delivery vehicle">
            <select
              id="onb-vehicle"
              className="select-field"
              value={form.vehicleType}
              onChange={(e) => setForm((c) => ({ ...c, vehicleType: e.target.value }))}
            >
              {vehicleOptions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Avg Weekly Earnings" icon={IndianRupee} id="onb-earnings" hint="Your typical weekly Blinkit payout">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
              <input
                id="onb-earnings"
                type="number"
                className="input-field pl-8"
                value={form.avgWeeklyEarnings}
                onChange={(e) => setForm((c) => ({ ...c, avgWeeklyEarnings: Number(e.target.value) }))}
              />
            </div>
          </FieldGroup>

          <FieldGroup label="Avg Daily Hours" icon={Clock} id="onb-hours" hint="Hours you typically deliver per day">
            <input
              id="onb-hours"
              type="number"
              min="1"
              max="16"
              className="input-field"
              value={form.avgDailyHours}
              onChange={(e) => setForm((c) => ({ ...c, avgDailyHours: Number(e.target.value) }))}
            />
          </FieldGroup>

          <FieldGroup label="Preferred Shift" icon={Sun} id="onb-shift" hint="When you usually deliver">
            <select
              id="onb-shift"
              className="select-field"
              value={form.preferredShift}
              onChange={(e) => setForm((c) => ({ ...c, preferredShift: e.target.value }))}
            >
              {shiftOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup
            label="Activity Score"
            icon={Activity}
            id="onb-score"
            hint="Delivery consistency score (0 to 1)"
          >
            <div className="space-y-2">
              <input
                id="onb-score"
                type="range"
                min="0"
                max="1"
                step="0.01"
                className="w-full accent-surge"
                value={form.activityScore}
                onChange={(e) => setForm((c) => ({ ...c, activityScore: Number(e.target.value) }))}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Low (0.0)</span>
                <span className="font-bold text-ink">{form.activityScore}</span>
                <span>High (1.0)</span>
              </div>
            </div>
          </FieldGroup>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save onboarding profile"}
          </Button>
        </div>

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
      </Card>
    </div>
  );
}
