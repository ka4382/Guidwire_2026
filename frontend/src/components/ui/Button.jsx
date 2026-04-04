import { motion } from "framer-motion";

export function Button({
  children,
  variant = "primary",
  size = "default",
  icon: Icon,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-br from-[#06141b] to-[#0f2b3a] text-white hover:shadow-lg active:scale-[0.98]",
    secondary:
      "bg-white text-ink border border-slate-200 hover:border-ocean hover:text-ocean active:scale-[0.98]",
    success:
      "bg-gradient-to-br from-[#17a673] to-[#0d9463] text-white hover:shadow-lg active:scale-[0.98]",
    danger:
      "bg-gradient-to-br from-[#ff7849] to-[#ff9a6c] text-white hover:opacity-90 active:scale-[0.98]",
    ghost:
      "bg-transparent text-ink hover:bg-ink/5 active:scale-[0.98]"
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs",
    default: "px-5 py-2.5 text-sm",
    large: "px-7 py-3.5 text-base"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon size={16} strokeWidth={2.5} /> : null}
      {children}
    </motion.button>
  );
}
