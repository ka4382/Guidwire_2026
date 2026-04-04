import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";
import { Lightbulb, TrendingDown, TrendingUp, Minus } from "lucide-react";

const directionConfig = {
  decrease: { icon: TrendingDown, color: "text-surge", bg: "bg-surge-light", label: "Discount" },
  increase: { icon: TrendingUp, color: "text-ember", bg: "bg-ember-light", label: "Increase" },
  neutral: { icon: Minus, color: "text-slate-500", bg: "bg-slate-100", label: "Neutral" }
};

export function PremiumExplanationPanel({ quote }) {
  if (!quote) return null;

  return (
    <Card className="h-full p-6" hover={false}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
          <Lightbulb size={16} className="text-amber-600" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ocean">
            Explainability
          </p>
          <h3 className="text-base font-extrabold text-ink">Why this weekly premium?</h3>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
        {quote.explanation}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {quote.pricing_factors?.map((factor) => {
          const conf = directionConfig[factor.direction] || directionConfig.neutral;
          const DirIcon = conf.icon;
          return (
            <div key={factor.label} className="rounded-xl bg-slate-50 p-3.5 transition-colors hover:bg-slate-100">
              <div className="flex items-center gap-2">
                <div className={`rounded-lg p-1.5 ${conf.bg}`}>
                  <DirIcon size={14} className={conf.color} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-ink">{factor.label}</p>
              </div>
              <p className="mt-1.5 pl-8 text-xs text-slate-500">
                {conf.label} of{" "}
                <span className="font-semibold text-ink">{formatCurrency(factor.value)}</span>
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
