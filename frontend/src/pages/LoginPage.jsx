import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Shield, User, Key, ChevronRight } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { demoCredentials } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState(demoCredentials.worker);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isWorkerDemo = form.email === demoCredentials.worker.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form);
      navigate(location.state?.from || (user.role === "admin" ? "/admin" : "/dashboard"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand strip */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#06141b] to-[#0f2b3a] text-sm font-black text-white shadow-lg">
            B
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink">BlinkShield AI</span>
        </div>

        <Card className="overflow-hidden p-0" hover={false}>
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#17a673] via-[#0d4c92] to-[#17a673]" />

          <div className="p-7 sm:p-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-ink">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-500">
                Sign in with a demo account to explore the platform
              </p>
            </div>

            {/* Demo account tabs */}
            <div className="mt-6 grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setForm(demoCredentials.worker)}
                className={`flex flex-col items-center gap-1.5 px-4 py-3.5 text-center transition-all ${
                  isWorkerDemo
                    ? "bg-white shadow-sm border-b-2 border-b-[#17a673]"
                    : "hover:bg-white/60"
                }`}
              >
                <User size={18} className={isWorkerDemo ? "text-[#17a673]" : "text-slate-400"} strokeWidth={2} />
                <span className={`text-xs font-bold ${isWorkerDemo ? "text-ink" : "text-slate-500"}`}>
                  Worker Demo
                </span>
                <span className="text-[10px] text-slate-400">asha@blinkshield</span>
              </button>
              <button
                type="button"
                onClick={() => setForm(demoCredentials.admin)}
                className={`flex flex-col items-center gap-1.5 px-4 py-3.5 text-center transition-all ${
                  !isWorkerDemo
                    ? "bg-white shadow-sm border-b-2 border-b-[#0d4c92]"
                    : "hover:bg-white/60"
                }`}
              >
                <Shield size={18} className={!isWorkerDemo ? "text-[#0d4c92]" : "text-slate-400"} strokeWidth={2} />
                <span className={`text-xs font-bold ${!isWorkerDemo ? "text-ink" : "text-slate-500"}`}>
                  Admin Demo
                </span>
                <span className="text-[10px] text-slate-400">admin@blinkshield</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="login-email" className="form-label">Email address</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                    className="input-field pl-10"
                    placeholder="you@blinkshield.demo"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="relative">
                  <Key size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                    className="input-field pl-10"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" icon={LogIn} disabled={loading}>
                {loading ? "Signing in..." : "Sign in to dashboard"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-[#0d4c92] transition-colors hover:text-[#17a673]"
              >
                Create a new worker account
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
