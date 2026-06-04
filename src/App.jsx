import { useState, useEffect } from "react";
import { T } from "./lib/data.js";
import { getSession, logout, saveGQ, getGQ } from "./lib/auth.js";
import { Toast } from "./components/ui.jsx";
import { Landing, Auth, Logo } from "./screens/Auth.jsx";
import { Assessment } from "./screens/Assessment.jsx";
import { OrgAssessment } from "./screens/OrgAssessment.jsx";
import { AICoach } from "./screens/AICoach.jsx";
import { AdminPanel } from "./screens/AdminPanel.jsx";
import {
  AdminOverview, AdminOrgs, AdminIndividuals, AdminMaterials, AdminAnalytics,
  OrgDashboard, IndDashboard, IndJournal, GQScoreView, LibraryView, CertifyView,
  BooksView, ArticlesView, ProgramsView,
} from "./screens/Views.jsx";

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${T.ivory};color:${T.charcoal}}
  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${T.ivoryDark}}::-webkit-scrollbar-thumb{background:${T.greenLight};border-radius:3px}
`;

const NAV = {
  admin: [
    ["admin-panel", "Admin Panel", "📊"],
    ["admin-materials", "Coaching Library", "📚"],
    ["books", "Books", "📕"], ["articles", "Articles", "📰"], ["programs", "Programs", "✨"],
  ],
  org: [
    ["org-dashboard", "Dashboard", "🏠"], ["org-assessment", "Org GQ Assessment", "🏢"], ["org-gq", "GQ Performance", "📊"],
    ["coach", "AI Coach", "🤖"], ["library", "Library", "📚"],
    ["certify", "Certifications", "🎓"], ["programs", "Programs", "✨"], ["books", "Books", "📕"],
  ],
  ind: [
    ["ind-dashboard", "Dashboard", "🏠"], ["ind-gq", "My GQ Score", "📊"],
    ["coach", "AI Coach", "🤖"], ["library", "Library", "📚"],
    ["certify", "Get Certified", "🎓"], ["journal", "Reflection Journal", "📓"],
    ["books", "Books", "📕"], ["articles", "Articles", "📰"],
  ],
};

export default function App() {
  const [user, setUser] = useState(null);
  const [pendingRole, setPendingRole] = useState(null); // role chosen, awaiting auth
  const [view, setView] = useState(null);
  const [gq, setGq] = useState(null);
  const [orgGq, setOrgGq] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [needsAssessment, setNeedsAssessment] = useState(false);

  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(""), 2600); };

  // restore session on load
  useEffect(() => {
    const s = getSession();
    if (s) { setUser(s); const g = getGQ(s.email); if (g?.byDim) { setOrgGq(g); } else { setGq(g); } landingView(s.role); }
  }, []);

  const landingView = (role) => setView(role === "admin" ? "admin-panel" : role === "org" ? "org-dashboard" : "ind-dashboard");

  const onAuthed = (u) => {
    setUser(u); setPendingRole(null);
    const g = getGQ(u.email); setGq(g);
    if (u.role === "ind" && !g) { setNeedsAssessment(true); }
    else landingView(u.role);
  };

  const finishAssessment = (result) => {
    if (result && user) { saveGQ(user.email, result); setGq(result); }
    setNeedsAssessment(false);
    landingView(user.role);
  };

  const doLogout = () => { logout(); setUser(null); setView(null); setGq(null); setOrgGq(null); setPendingRole(null); };

  // ── render gates ──
  if (!user && !pendingRole) return <><style>{GLOBAL}</style><Landing onChoose={setPendingRole} /></>;
  if (!user && pendingRole) return <><style>{GLOBAL}</style><Auth role={pendingRole} onAuthed={onAuthed} onBack={() => setPendingRole(null)} /></>;
  if (needsAssessment) return <><style>{GLOBAL}</style><Assessment onComplete={finishAssessment} onSkip={() => finishAssessment(null)} /></>;
  if (view === "org-assessment") return <><style>{GLOBAL}</style><OrgAssessment
    onComplete={(r) => { if (r && user) { saveGQ(user.email, r); setOrgGq(r); } setView("org-dashboard"); }}
    onSkip={() => setView("org-dashboard")} /></>;
  if (view === "assessment") return <><style>{GLOBAL}</style><Assessment onComplete={(r) => { if (r && user) { saveGQ(user.email, r); setGq(r); } setView(user.role === "ind" ? "ind-dashboard" : "org-dashboard"); }} onSkip={() => setView(user.role === "ind" ? "ind-dashboard" : "org-dashboard")} /></>;

  const goTo = (v) => setView(v);
  const ut = user.role;
  const nav = NAV[ut];

  const render = () => {
    switch (view) {
      case "admin-panel": return <AdminPanel toast={toast} />;
      case "admin-materials": return <AdminMaterials toast={toast} />;
      case "org-dashboard": return <OrgDashboard gq={gq} orgGq={orgGq} goTo={goTo} />;
      case "org-gq": return <GQScoreView userType="org" gq={gq} goTo={goTo} />;
      case "ind-dashboard": return <IndDashboard gq={gq} userName={user.name} goTo={goTo} />;
      case "ind-gq": return <GQScoreView userType="ind" gq={gq} goTo={goTo} />;
      case "coach": return <AICoach userType={ut} userName={user.name} />;
      case "library": return <LibraryView toast={toast} />;
      case "certify": return <CertifyView gq={gq} toast={toast} />;
      case "journal": return <IndJournal toast={toast} />;
      case "books": return <BooksView toast={toast} />;
      case "articles": return <ArticlesView toast={toast} />;
      case "programs": return <ProgramsView toast={toast} />;
      default: return null;
    }
  };

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{GLOBAL}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: 224, background: T.green, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}><Logo /></div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.green, flexShrink: 0 }}>{initials}</div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: T.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{ut === "ind" ? "Individual" : ut}{user.org ? ` · ${user.org}` : ""}</p>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
            {nav.map(([id, label, icon]) => (
              <button key={id} onClick={() => setView(id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: view === id ? "rgba(255,255,255,0.12)" : "transparent", color: view === id ? T.white : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: view === id ? 500 : 400, marginBottom: 2, textAlign: "left", cursor: "pointer" }}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "12px 16px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={doLogout} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer" }}>Log Out</button>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>Powered by Susan K. Wehrley's<br />Gut Intelligence® Architecture</p>
          </div>
        </div>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", background: T.ivory, minWidth: 0 }}>
          <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
            <p style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{ut === "admin" ? "Admin Portal" : ut === "org" ? "Organization Portal" : "Individual Portal"}</p>
            <div style={{ width: 32, height: 32, background: T.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: T.green, fontSize: 12 }}>{initials}</div>
          </div>
          <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>{render()}</div>
        </main>
      </div>
      <Toast msg={toastMsg} />
    </>
  );
}
