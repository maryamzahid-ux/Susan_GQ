import { T } from "../lib/data.js";

export const GQRing = ({ score, size = 64, stroke = 5 }) => {
  const r = (size - stroke * 2) / 2, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.ivoryDark} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.gold} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%", fontSize: size * 0.24, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fill: T.charcoal }}>
        {score}
      </text>
    </svg>
  );
};

export const Badge = ({ label, color = T.green, bg = "#E8F4EE" }) => (
  <span style={{ display: "inline-block", background: bg, color, fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20, letterSpacing: "0.03em" }}>{label}</span>
);

export const ProgressBar = ({ pct, color = T.greenLight }) => (
  <div style={{ background: T.ivoryDark, borderRadius: 6, height: 7, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 1s ease" }} />
  </div>
);

export const StatCard = ({ label, value, sub, icon }) => (
  <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 150 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 700, color: T.charcoal, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: T.muted, marginTop: 5 }}>{sub}</p>}
      </div>
      <div style={{ fontSize: 22, opacity: 0.5 }}>{icon}</div>
    </div>
  </div>
);

export const Card = ({ children, style }) => (
  <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", ...style }}>{children}</div>
);

export const Btn = ({ children, onClick, variant = "primary", style, disabled, full }) => {
  const styles = {
    primary:   { background: disabled ? T.border : T.green, color: T.white, border: "none" },
    gold:      { background: T.gold, color: T.white, border: "none" },
    secondary: { background: T.goldPale, color: T.green, border: `1px solid ${T.border}` },
    ghost:     { background: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger:    { background: "transparent", color: T.danger, border: `1px solid ${T.border}` },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, transition: "all 0.15s", width: full ? "100%" : "auto", cursor: disabled ? "not-allowed" : "pointer", ...styles[variant], ...style }}>
      {children}
    </button>
  );
};

// Toast notification (for working CTAs)
export const Toast = ({ msg, onDone }) => {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: T.green, color: T.white, padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 1000, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "toastIn 0.3s ease" }}>
      {msg}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
};

// Modal (for material player, certificates, etc.)
export const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(27,67,50,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 900, padding: 20, animation: "fadeIn 0.2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.white, borderRadius: 16, width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: T.green }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 22, color: T.muted, lineHeight: 1, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "22px" }}>{children}</div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};
