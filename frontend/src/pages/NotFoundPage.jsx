import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinOff, Home } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="max-w-lg p-10 text-center" hover={false}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-light">
            <MapPinOff size={28} className="text-ocean" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-ocean">404</p>
          <h1 className="mt-3 text-2xl font-extrabold text-ink">
            This route is outside the Blinkit zone map.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Head back to the dashboard or the landing page to continue the demo flow.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button icon={Home}>Go home</Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
