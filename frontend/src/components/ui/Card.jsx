export function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`${hover ? "glass-card" : "glass rounded-3xl shadow-card"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
