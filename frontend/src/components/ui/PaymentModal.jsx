import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  IndianRupee,
  Loader2
} from "lucide-react";
import { Button } from "./Button";
import { formatCurrency } from "../../utils/formatters";

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  premiumAmount = 48,
  coverageAmount = 460
}) {
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setMethod("upi");
      setStatus("idle");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async () => {
    setLoading(true);
    setStatus("processing");
    try {
      // Small artificial delay to simulate opening gateway
      await new Promise((res) => setTimeout(res, 800));
      await onSuccess(method);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Close button */}
          {status !== "success" && (
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          )}

          {/* Header */}
          <div className="bg-slate-50 px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-black text-ink flex items-center gap-2">
              <ShieldCheck className="text-ocean" /> Complete Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Activate your BlinkShield AI Income Protection
            </p>
          </div>

          <div className="p-6">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Payment Successful!</h3>
                <p className="text-slate-600 mb-6">
                  ✅ Policy Activated<br />
                  <span className="text-sm">You are protected for 7 days</span>
                </p>
                <div className="rounded-xl bg-emerald-50 p-4 mb-6 text-sm text-emerald-800 font-medium border border-emerald-100">
                  Your BlinkShield coverage is now active against weather and API disruptions.
                </div>
                <Button fullWidth onClick={onClose}>
                  Go to Dashboard
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Summary Card */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Weekly Premium</span>
                    <span className="text-xl font-black text-ink">{formatCurrency(premiumAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Coverage Provided</span>
                    <span className="text-sm font-bold text-ocean">Up to {formatCurrency(coverageAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-500">Validity</span>
                    <span className="text-sm font-bold text-ink">7 Days</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Select Method</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setMethod("upi")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      method === "upi"
                        ? "border-ocean bg-ocean/5 text-ocean"
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <QrCode size={24} />
                    <span className="text-sm font-bold">UPI / QR</span>
                  </button>
                  <button
                    onClick={() => setMethod("card")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      method === "card"
                        ? "border-ocean bg-ocean/5 text-ocean"
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-sm font-bold">Credit/Debit</span>
                  </button>
                </div>

                {/* Mock Inputs based on method */}
                <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  {method === "upi" ? (
                    <div className="text-center">
                      <div className="mx-auto w-[150px] h-[150px] bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=blinkshield@upi&pn=BlinkShield&am=${premiumAmount}`}
                          alt="UPI QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML = '<div class="text-slate-300 flex justify-center w-full"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg></div>';
                          }}
                        />
                      </div>
                      <p className="text-xs font-bold text-ocean mb-1">Scan or click ‘Pay’ to simulate payment</p>
                      <p className="text-xs text-slate-500">Scan via GPay, PhonePe, Paytm</p>
                      <div className="mt-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 py-2 rounded">
                        blinkshield@upi
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500">Card Number</label>
                        <input 
                          type="text"
                          placeholder="0000 0000 0000 0000" 
                          maxLength="19"
                          autoComplete="off"
                          className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500">Expiry (MM/YY)</label>
                          <input 
                            type="text"
                            placeholder="MM/YY" 
                            maxLength="5"
                            autoComplete="off"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500">CVV</label>
                          <input 
                            type="password"
                            placeholder="123" 
                            maxLength="4"
                            autoComplete="off"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {status === "error" && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                    <AlertCircle size={16} />
                    <span>Payment failed. Please try again.</span>
                  </div>
                )}

                <Button
                  fullWidth
                  onClick={handlePay}
                  disabled={loading}
                  className="relative overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={18} className="animate-spin" /> Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      Pay {formatCurrency(premiumAmount)}
                    </span>
                  )}
                </Button>
                <p className="mt-4 text-center text-[10px] text-slate-400">
                  Secured by MockPay™ for Hackathon Purposes only.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
