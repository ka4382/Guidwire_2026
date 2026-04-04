import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, User, Phone, Mail, Key, MapPin, Building2, CreditCard, ChevronRight } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { zoneOptions } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

const zoneDarkStoreMap = {
  "Koramangala-5th-Block": "BLR-KRM-01",
  "HSR-Layout-Sector-2": "BLR-HSR-02",
  "Indiranagar-100ft": "BLR-IDR-03",
  "Powai-LakeSide": "MUM-PWY-01"
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "Pass@123",
    city: "Bengaluru",
    assignedZone: "Koramangala-5th-Block",
    darkStoreId: "BLR-KRM-01",
    payoutMethod: {
      provider: "mock-razorpay",
      upiId: "",
      accountName: ""
    }
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/onboarding");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
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
              <h1 className="text-2xl font-extrabold tracking-tight text-ink">Create your account</h1>
              <p className="mt-2 text-sm text-slate-500">
                Set up your delivery partner profile for BlinkShield coverage
              </p>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-6">
              {/* Section: Personal */}
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <User size={12} strokeWidth={2.5} />
                  Personal details
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reg-name" className="form-label">Full name</label>
                    <div className="relative">
                      <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="reg-name" className="input-field pl-10" placeholder="Asha Kumar" value={form.name} onChange={(e) => set("name", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="form-label">Phone number</label>
                    <div className="relative">
                      <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="reg-phone" className="input-field pl-10" placeholder="9876543210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="form-label">Email</label>
                    <div className="relative">
                      <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="reg-email" type="email" className="input-field pl-10" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-password" className="form-label">Password</label>
                    <div className="relative">
                      <Key size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="reg-password" type="password" className="input-field pl-10" placeholder="Strong password" value={form.password} onChange={(e) => set("password", e.target.value)} />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Section: Zone */}
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <MapPin size={12} strokeWidth={2.5} />
                  Delivery zone
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reg-city" className="form-label">City</label>
                    <div className="relative">
                      <Building2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="reg-city" className="input-field pl-10" placeholder="Bengaluru" value={form.city} onChange={(e) => set("city", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-zone" className="form-label">Assigned zone</label>
                    <div className="relative">
                      <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        id="reg-zone"
                        className="select-field pl-10"
                        value={form.assignedZone}
                        onChange={(e) =>
                          setForm((c) => ({
                            ...c,
                            assignedZone: e.target.value,
                            darkStoreId: zoneDarkStoreMap[e.target.value]
                          }))
                        }
                      >
                        {zoneOptions.map((zone) => (
                          <option key={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Section: Payout */}
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <CreditCard size={12} strokeWidth={2.5} />
                  Payout method
                </legend>
                <div>
                  <label htmlFor="reg-upi" className="form-label">UPI ID for payouts</label>
                  <div className="relative">
                    <CreditCard size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reg-upi"
                      className="input-field pl-10"
                      placeholder="name@upi"
                      value={form.payoutMethod.upiId}
                      onChange={(e) =>
                        setForm((c) => ({
                          ...c,
                          payoutMethod: { ...c.payoutMethod, upiId: e.target.value, accountName: c.name }
                        }))
                      }
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Demo payouts use mock Razorpay — no real transactions
                  </p>
                </div>
              </fieldset>

              {error ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" icon={UserPlus} disabled={loading}>
                {loading ? "Creating account..." : "Create account & continue"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-[#0d4c92] transition-colors hover:text-[#17a673]"
              >
                Already have an account? Sign in
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
