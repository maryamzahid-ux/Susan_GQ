import { useState } from "react";
import { T } from "../lib/data.js";
import { login, signup, DEMO } from "../lib/auth.js";
import { Btn } from "../components/ui.jsx";

// ─── LANDING ───
export function Landing({ onChoose }) {
  const [hover, setHover] = useState(null);
  const cards = [
    { key: "org", icon: "🏢", title: "I'm an Organization", sub: "For companies, teams & enterprises",
      bullets: ["Team GQ performance dashboards", "License the full GQ Architecture", "AI coaching for all employees", "Org-wide certification programs"] },
    { key: "ind", icon: "👤", title: "I'm an Individual", sub: "For executives, leaders & entrepreneurs",
      bullets: ["Personal GQ assessment & tracking", "1-on-1 AI coaching sessions", "Self-paced learning library", "Individual certification"] },
  ];
  return (
    <div style={{ minHeight: "100vh", background: T.ivory }}>
      <header style={{ background: T.green, padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo />
        </div>
        <Btn variant="ghost" onClick={() => onChoose("admin")} style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.3)" }}>Admin Login</Btn>
      </header>

      <div style={{ background: `linear-gradient(135deg,${T.green} 0%,${T.greenMid} 60%,${T.greenLight} 100%)`, padding: "70px 48px 78px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%,rgba(183,136,44,0.18) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,0.06) 0%,transparent 50%)` }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-block", background: "rgba(183,136,44,0.2)", border: `1px solid ${T.gold}`, borderRadius: 20, padding: "5px 16px", marginBottom: 22 }}>
            <p style={{ color: T.goldLight, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em" }}>THE NECESSARY INTELLIGENCE FOR UNPRECEDENTED TIMES</p>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: 50, fontWeight: 700, lineHeight: 1.15, maxWidth: 760, margin: "0 auto 18px" }}>
            The Gut Intelligence®<br />Performance Platform
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Synthesize the wisdom of your gut, heart, head & intuition. Make decisions aligned to your vision, values, and goals.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", padding: "56px 48px", gap: 30, flexWrap: "wrap" }}>
        {cards.map((c) => (
          <div key={c.key} onMouseEnter={() => setHover(c.key)} onMouseLeave={() => setHover(null)} onClick={() => onChoose(c.key)}
            style={{ background: T.white, border: `2px solid ${hover === c.key ? T.gold : T.border}`, borderRadius: 20, padding: "38px 34px", width: 340, cursor: "pointer", transition: "all 0.2s", transform: hover === c.key ? "translateY(-6px)" : "none", boxShadow: hover === c.key ? "0 20px 40px rgba(27,67,50,0.12)" : "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>{c.icon}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, color: T.green, marginBottom: 6 }}>{c.title}</h2>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 22 }}>{c.sub}</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {c.bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: T.charcoal }}>
                  <span style={{ color: T.gold, fontWeight: 700 }}>✓</span>{b}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 28, background: hover === c.key ? T.green : T.goldPale, color: hover === c.key ? T.white : T.green, borderRadius: 10, padding: "12px", textAlign: "center", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
              {hover === c.key ? "Continue →" : "Get Started"}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: T.green, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: T.green }}>SK</div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: T.white, fontSize: 13, fontWeight: 500 }}>Susan K. Wehrley — 37-Year Executive Coach · Forbes Coaches Council · Original Gut Intelligence® Trademark Holder (2016)</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Author of 12 books · 30+ clients incl. Harley-Davidson, Pepsi, Summit Credit Union · bizremedies.com</p>
        </div>
      </div>
    </div>
  );
}

export function Logo({ light = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 38, height: 38, background: T.gold, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>⚡</div>
      <div>
        <p style={{ fontFamily: "'Playfair Display',serif", color: light ? T.white : T.green, fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>GQ Platform</p>
        <p style={{ color: T.goldLight, fontSize: 10 }}>Gut Intelligence® by Susan K. Wehrley</p>
      </div>
    </div>
  );
}

// ─── AUTH (login / signup for a chosen role) ───
export function Auth({ role, onAuthed, onBack }) {
  const [mode, setMode] = useState("signup"); // signup | login
  const [form, setForm] = useState({ name: "", email: "", password: "", org: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleLabel = role === "admin" ? "Admin" : role === "org" ? "Organization" : "Individual";

  const submit = () => {
    setError(""); setLoading(true);
    setTimeout(() => { // simulate network
      const res = mode === "signup"
        ? signup({ ...form, role })
        : login({ email: form.email, password: form.password });
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      // enforce role match on login (admin must log into admin, etc.)
      if (mode === "login" && res.user.role !== role) {
        setError(`This account is registered as "${res.user.role}", not "${role}". Use the correct portal.`);
        return;
      }
      onAuthed(res.user);
    }, 500);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.white, borderRadius: 20, width: 440, maxWidth: "100%", padding: "36px 38px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: T.gold, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px" }}>⚡</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: T.green, marginBottom: 4 }}>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: 13, color: T.muted }}>{roleLabel} portal · Gut Intelligence® Platform</p>
        </div>

        {/* mode toggle */}
        <div style={{ display: "flex", background: T.ivory, borderRadius: 10, padding: 4, marginBottom: 22 }}>
          {["signup", "login"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: mode === m ? T.white : "transparent", color: mode === m ? T.green : T.muted, fontSize: 13, fontWeight: 600, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none", cursor: "pointer" }}>
              {m === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="Jane Leader" />
          )}
          {mode === "signup" && role === "org" && (
            <Field label="Organization Name" value={form.org} onChange={set("org")} placeholder="Acme Corp" />
          )}
          <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
          <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()} />

          {error && <p style={{ fontSize: 13, color: T.danger, background: "#FBEAE8", padding: "10px 12px", borderRadius: 8 }}>{error}</p>}

          <Btn full onClick={submit} disabled={loading} style={{ padding: "12px", marginTop: 4 }}>
            {loading ? "Please wait…" : mode === "signup" ? "Create Account →" : "Log In →"}
          </Btn>
        </div>

        {role === "admin" && (
          <div style={{ marginTop: 16, background: T.goldPale, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: T.green, lineHeight: 1.6 }}>
            <strong>Demo admin (Susan):</strong><br />
            {DEMO.admin.email} · password: {DEMO.admin.password}
          </div>
        )}

        <button onClick={onBack} style={{ marginTop: 20, background: "transparent", border: "none", color: T.muted, fontSize: 13, cursor: "pointer", display: "block", margin: "20px auto 0" }}>← Back to role selection</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, onKeyDown }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.charcoal, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
        style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, background: T.ivory, outline: "none", color: T.charcoal }} />
    </div>
  );
}
