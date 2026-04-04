import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  CloudRain,
  Wind,
  MapPin,
  Zap,
  ArrowRight,
  Bot,
  Lock,
  Thermometer,
  Radio
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const steps = [
  { num: "01", text: "Partner registers and receives a zone-aware weekly quote." },
  { num: "02", text: "BlinkShield monitors rainfall, AQI, closures, and outages." },
  { num: "03", text: "Parametric trigger fires, fraud agent validates telemetry." },
  { num: "04", text: "Claim agent approves, flags, or rejects with explainability." },
  { num: "05", text: "Payout agent simulates instant compensation in demo mode." }
];

const features = [
  {
    icon: Shield,
    title: "Blinkit-Only Protection",
    desc: "Weekly income cover built exclusively for dark-store delivery partners.",
    color: "text-[#17a673]",
    bg: "bg-[#e6f9f1]"
  },
  {
    icon: MapPin,
    title: "Hyperlocal Risk Pricing",
    desc: "Zone and dark-store aware premium calculation for each micro-zone.",
    color: "text-[#0d4c92]",
    bg: "bg-[#e8f0fa]"
  },
  {
    icon: Zap,
    title: "Zero-Touch Claims",
    desc: "Automated parametric triggers from weather, AQI, closures, and outages.",
    color: "text-[#ff7849]",
    bg: "bg-[#fff1eb]"
  },
  {
    icon: Lock,
    title: "Fraud Resistant",
    desc: "Isolation Forest model detects GPS spoofing and suspicious patterns.",
    color: "text-[#06141b]",
    bg: "bg-slate-100"
  }
];

const triggers = [
  { icon: CloudRain, label: "Heavy Rainfall", threshold: ">50 mm" },
  { icon: Thermometer, label: "Extreme Heat", threshold: ">42°C" },
  { icon: Wind, label: "Severe AQI", threshold: ">300" },
  { icon: MapPin, label: "Zone Closure", threshold: "Geofenced" },
  { icon: Radio, label: "Platform Outage", threshold: "Suspended" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.4, 0, 0.2, 1] }
  })
};

export function LandingPage() {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center justify-between rounded-2xl px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#06141b] to-[#0f2b3a] text-sm font-black text-white shadow-md">
              B
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d4c92]">
                Guidewire DEVTrails 2026
              </p>
              <h1 className="text-sm font-extrabold text-ink">BlinkShield AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="small">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="small" icon={ArrowRight}>Get Started</Button>
            </Link>
          </div>
        </motion.header>

        {/* Hero */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left — Hero */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass rounded-[28px] p-8 sm:p-10 lg:p-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f9f1] px-4 py-1.5">
              <Bot size={14} className="text-[#17a673]" strokeWidth={2.5} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#17a673]">
                Agentic AI Insurance
              </span>
            </div>
            <h2 className="mt-6 max-w-xl text-3xl font-black leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.8rem]">
              Income protection for{" "}
              <span className="bg-gradient-to-r from-[#17a673] to-[#0d4c92] bg-clip-text text-transparent">
                Blinkit delivery windows
              </span>
              , not generic gig work.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
              BlinkShield AI tracks hyperlocal weather, pollution, dark-store closures, and order
              suspensions to auto-protect Blinkit partners from weekly income loss.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="large" icon={ArrowRight}>Start worker onboarding</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="large">Open demo accounts</Button>
              </Link>
            </div>

            {/* Trigger pills */}
            <div className="mt-10 flex flex-wrap gap-2">
              {triggers.map((t) => {
                const TIcon = t.icon;
                return (
                  <div
                    key={t.label}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs transition-colors hover:border-[#0d4c92]/30"
                  >
                    <TIcon size={13} className="text-[#0d4c92]" strokeWidth={2} />
                    <span className="font-semibold text-ink">{t.label}</span>
                    <span className="text-slate-400">{t.threshold}</span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Right — Zero-touch + Features */}
          <div className="space-y-6">
            {/* Zero-touch flow */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="overflow-hidden p-0" hover={false}>
                <div className="bg-gradient-to-br from-[#06141b] to-[#0f2b3a] p-6">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-[#17a673]" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                      Zero-touch flow
                    </p>
                  </div>
                  <div className="mt-5 space-y-3.5">
                    {steps.map((s, i) => (
                      <motion.div
                        key={s.num}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex items-start gap-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] font-bold text-white/70">
                          {s.num}
                        </span>
                        <p className="text-[13px] leading-relaxed text-white/80">{s.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => {
                const FIcon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    custom={i + 3}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                  >
                    <Card className="h-full p-4">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${f.bg}`}>
                        <FIcon size={18} className={f.color} strokeWidth={2} />
                      </div>
                      <h3 className="mt-3 text-[13px] font-bold leading-snug text-ink">{f.title}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{f.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pb-6 text-center text-xs text-slate-400"
        >
          Built for Guidewire DEVTrails 2026 — Parametric Insurance × Agentic AI
        </motion.footer>
      </div>
    </div>
  );
}
