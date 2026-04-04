import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, CheckCircle2, MapPin, CloudRain } from "lucide-react";

import { appApi } from "../../api/appApi";
import { triggerOptions, zoneOptions } from "../../utils/constants";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function DemoSimulator({ onSimulated }) {
  const [type, setType] = useState("heavy_rainfall");
  const [zone, setZone] = useState("Koramangala-5th-Block");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runSimulation = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await appApi.simulateDisruption({ type, zone });
      setMessage(
        `Triggered ${result.event.type} and evaluated ${result.affectedWorkers} workers.`
      );
      onSimulated?.(result);
    } catch (error) {
      setMessage(error.response?.data?.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full p-6" hover={false}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-light">
          <Zap size={16} className="text-ocean" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ocean">Demo mode</p>
          <h3 className="text-base font-extrabold text-ink">One-click disruption simulation</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sim-type" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <CloudRain size={12} /> Trigger type
          </label>
          <select
            id="sim-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select-field"
          >
            {triggerOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sim-zone" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <MapPin size={12} /> Zone
          </label>
          <select
            id="sim-zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="select-field"
          >
            {zoneOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        variant="success"
        icon={Play}
        className="mt-5 w-full"
        onClick={runSimulation}
        disabled={loading}
      >
        {loading ? "Running simulation..." : "Run zero-touch chain"}
      </Button>

      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-start gap-2 rounded-xl bg-surge-light border border-emerald-200 px-4 py-3 text-sm font-medium text-surge"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" strokeWidth={2.5} />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </Card>
  );
}
