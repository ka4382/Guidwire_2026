import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        {eyebrow ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-ocean-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ocean">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ocean" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink md:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </motion.div>
  );
}
