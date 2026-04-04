import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Radio,
  ClipboardList,
  ClipboardCheck,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

const workerNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/quote", label: "Quote", icon: FileText },
  { to: "/file-claim", label: "File a Claim", icon: ShieldAlert },
  { to: "/monitor", label: "Live Monitor", icon: Radio },
  { to: "/claims", label: "Claim History", icon: ClipboardList },
  { to: "/payouts", label: "Payouts", icon: Wallet }
];

const adminNav = [
  { to: "/admin", label: "Admin Overview", icon: ShieldCheck, end: true },
  { to: "/admin/claims", label: "Claims Review", icon: ClipboardCheck },
  { to: "/monitor", label: "Disruptions", icon: Zap },
  { to: "/admin/fraud", label: "Fraud Alerts", icon: AlertTriangle }
];

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = user?.role === "admin" ? adminNav : workerNav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sidebarContent = (
    <>
      {/* Brand */}
      <Link
        to="/"
        className="group block overflow-hidden rounded-2xl bg-gradient-to-br from-[#06141b] to-[#0f2b3a] p-5 text-white transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-black backdrop-blur-sm">
            B
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              BlinkShield AI
            </p>
            <p className="mt-0.5 text-sm font-bold leading-tight text-white/90">
              Income protection
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
          Navigation
        </p>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-[#17a673] to-[#0d9463] text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "text-white" : "text-slate-400 group-hover:text-ink"}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive ? (
                    <ChevronRight size={14} className="text-white/60" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User card */}
      <div className="mt-auto rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0d4c92] to-[#1a6dd1] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">
              {user?.role === "admin" ? "Insurer Admin" : user?.assignedZone}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-4">
      {/* Mobile header */}
      <div className="mb-3 flex items-center justify-between rounded-2xl glass px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#06141b] to-[#0f2b3a] text-sm font-black text-white">
            B
          </div>
          <span className="text-sm font-bold text-ink">BlinkShield AI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2 text-ink hover:bg-slate-100"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col glass-heavy p-4 shadow-lift-lg md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {/* Desktop layout */}
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:flex md:flex-col glass rounded-3xl p-4">
          {sidebarContent}
        </aside>

        <main className="glass rounded-3xl p-5 md:p-8 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
