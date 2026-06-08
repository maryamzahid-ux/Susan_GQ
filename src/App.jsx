import { useState, useEffect } from "react";
import { T } from "./lib/data.js";
import { getSession, logout, saveGQ, getGQ } from "./lib/auth.js";
import { Toast } from "./components/ui.jsx";
import { SidebarLogo } from "./components/Logo.jsx";
import { Landing, Auth } from "./screens/Auth.jsx";
import { Assessment } from "./screens/Assessment.jsx";
import { OrgAssessment } from "./screens/OrgAssessment.jsx";
import { AICoach } from "./screens/AICoach.jsx";
import { AdminPanel } from "./screens/AdminPanel.jsx";
import {
  AdminMaterials, OrgDashboard, IndDashboard, IndJournal,
  GQScoreView, LibraryView, CertifyView, BooksView, ArticlesView, ProgramsView,
} from "./screens/Views.jsx";

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${T.ivory};color:${T.charcoal}}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${T.ivoryDark}}::-webkit-scrollbar-thumb{background:${T.greenLight};border-radius:3px}
  .nav-btn:hover{background:rgba(255,255,255,0.09)!important;color:rgba(255,255,255,0.95)!important}
`;

const NAV = {
  admin: [
    { id: "admin-panel",     label: "Overview"         },
    { id: "admin-materials", label: "Coaching Library" },
    { group: "Content", children: [
      { id: "books",    label: "Books"    },
      { id: "articles", label: "Articles" },
      { id: "programs", label: "Programs" },
    ]},
  ],
  org: [
    { id: "org-dashboard",  label: "Dashboard"      },
    { id: "org-assessment", label: "Org Assessment" },
    { id: "org-gq",         label: "GQ Performance" },
    { id: "coach",          label: "AI Coach"       },
    { id: "certify",        label: "Certifications" },
    { group: "Resources", children: [
      { id: "library",  label: "Library"  },
      { id: "books",    label: "Books"    },
      { id: "programs", label: "Programs" },
    ]},
  ],
  ind: [
    { id: "ind-dashboard", label: "Dashboard"         },
    { id: "ind-gq",        label: "My GQ Score"       },
    { id: "coach",         label: "AI Coach"           },
    { id: "certify",       label: "Get Certified"      },
    { id: "journal",       label: "Reflection Journal" },
    { group: "Resources", children: [
      { id: "library",  label: "Library"  },
      { id: "books",    label: "Books"    },
      { id: "articles", label: "Articles" },
      { id: "programs", label: "Programs" },
    ]},
  ],
};

function SideNav({ nav, view, setView }) {
  const findGroup = (n, v) => n.find(i => i.group && i.children.some(c => c.id === v))?.group;
  const [openGroup, setOpenGroup] = useState(() => findGroup(nav, view));

  useEffect(() => {
    const g = findGroup(nav, view);
    if (g) setOpenGroup(g);
  }, [view]);

  const NavBtn = ({ id, label, indent = false }) => {
    const active = view === id;
    return (
      <button className="nav-btn" onClick={() => setView(id)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: indent ? "6px 12px 6px 26px" : "8px 12px",
          borderRadius: 7, border: "none",
          background: active ? "rgba(255,255,255,0.13)" : "transparent",
          color: active ? "#FFFFFF" : "rgba(255,255,255,0.58)",
          fontSize: indent ? 12 : 13,
          fontWeight: active ? 600 : 400,
          marginBottom: 1, textAlign: "left", cursor: "pointer",
          transition: "all 0.13s",
        }}>
        {active && <div style={{ width: 3, height: 14, background: T.gold, borderRadius: 2, flexShrink: 0 }} />}
        {label}
      </button>
    );
  };

  return (
    <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
      {nav.map((item) => {
        if (item.id) return <NavBtn key={item.id} id={item.id} label={item.label} />;
        const isOpen = openGroup === item.group;
        const hasActive = item.children.some(c => c.id === view);
        return (
          <div key={item.group}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "6px 4px 4px" }} />
            <button className="nav-btn" onClick={() => setOpenGroup(isOpen ? null : item.group)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 12px", borderRadius: 7, border: "none", background: "transparent",
                color: hasActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.38)",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
                cursor: "pointer", marginBottom: 2,
              }}>
              <span>{item.group}</span>
              <span style={{ fontSize: 8, opacity: 0.6, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ marginBottom: 2 }}>
                {item.children.map(c => <NavBtn key={c.id} id={c.id} label={c.label} indent />)}
              </div>
            )}
            {!isOpen && hasActive && (
              <p style={{ padding: "2px 12px 4px 26px", fontSize: 11, color: T.goldLight }}>
                {item.children.find(c => c.id === view)?.label}
              </p>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [user, setUser]           = useState(null);
  const [pendingRole, setPending] = useState(null);
  const [view, setView]           = useState(null);
  const [gq, setGq]               = useState(null);
  const [orgGq, setOrgGq]         = useState(null);
  const [toastMsg, setToast]      = useState("");
  const [needsAssessment, setNA]  = useState(false);

  const toast = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };

  useEffect(() => {
    const s = getSession();
    if (s) {
      setUser(s);
      const g = getGQ(s.email);
      if (g?.byDim) setOrgGq(g); else setGq(g);
      landingView(s.role);
    }
  }, []);

  const landingView = (role) =>
    setView(role === "admin" ? "admin-panel" : role === "org" ? "org-dashboard" : "ind-dashboard");

  const onAuthed = (u) => {
    setUser(u); setPending(null);
    const g = getGQ(u.email); setGq(g);
    if (u.role === "ind" && !g) setNA(true);
    else landingView(u.role);
  };

  const finishAssessment = (result) => {
    if (result && user) { saveGQ(user.email, result); setGq(result); }
    setNA(false);
    landingView(user.role);
  };

  const doLogout = () => {
    logout(); setUser(null); setView(null);
    setGq(null); setOrgGq(null); setPending(null);
  };

  const goTo = (v) => setView(v);

  if (!user && !pendingRole) return <><style>{GLOBAL}</style><Landing onChoose={setPending} /></>;
  if (!user && pendingRole)  return <><style>{GLOBAL}</style><Auth role={pendingRole} onAuthed={onAuthed} onBack={() => setPending(null)} /></>;
  if (needsAssessment)       return <><style>{GLOBAL}</style><Assessment onComplete={finishAssessment} onSkip={() => finishAssessment(null)} /></>;
  if (view === "org-assessment") return (
    <><style>{GLOBAL}</style>
      <OrgAssessment
        onComplete={(r) => { if (r && user) { saveGQ(user.email, r); setOrgGq(r); } setView("org-dashboard"); }}
        onSkip={() => setView("org-dashboard")} />
    </>
  );
  if (view === "assessment") return (
    <><style>{GLOBAL}</style>
      <Assessment
        onComplete={(r) => { if (r && user) { saveGQ(user.email, r); setGq(r); } landingView(user.role); }}
        onSkip={() => landingView(user.role)} />
    </>
  );

  const ut  = user.role;
  const nav = NAV[ut];
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const portalLabel = ut === "admin" ? "Admin Portal" : ut === "org" ? "Organization Portal" : "Individual Portal";

  const render = () => {
    switch (view) {
      case "admin-panel":     return <AdminPanel toast={toast} />;
      case "admin-materials": return <AdminMaterials toast={toast} />;
      case "org-dashboard":   return <OrgDashboard gq={gq} orgGq={orgGq} goTo={goTo} />;
      case "org-gq":          return <GQScoreView userType="org" gq={gq} goTo={goTo} />;
      case "ind-dashboard":   return <IndDashboard gq={gq} userName={user.name} goTo={goTo} />;
      case "ind-gq":          return <GQScoreView userType="ind" gq={gq} goTo={goTo} />;
      case "coach":           return <AICoach userType={ut} userName={user.name} />;
      case "library":         return <LibraryView toast={toast} />;
      case "certify":         return <CertifyView gq={gq} toast={toast} />;
      case "journal":         return <IndJournal toast={toast} />;
      case "books":           return <BooksView toast={toast} />;
      case "articles":        return <ArticlesView toast={toast} />;
      case "programs":        return <ProgramsView toast={toast} />;
      default:                return null;
    }
  };

  return (
    <>
      <style>{GLOBAL}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: 218, background: T.green, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <SidebarLogo />
          </div>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.green, flexShrink: 0 }}>{initials}</div>
              <div style={{ overflow: "hidden", minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                  {ut === "ind" ? "Individual" : ut === "org" ? "Organization" : "Admin"}
                  {user.org ? ` · ${user.org}` : ""}
                </p>
              </div>
            </div>
          </div>
          <SideNav nav={nav} view={view} setView={setView} />
          <div style={{ padding: "10px 12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={doLogout}
              style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 7, padding: "8px", fontSize: 12, cursor: "pointer", marginBottom: 10 }}>
              Log Out
            </button>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.6 }}>
              Powered by Susan K. Wehrley's<br />Gut Intelligence® Architecture
            </p>
          </div>
        </div>
        <main style={{ flex: 1, overflowY: "auto", background: T.ivory, minWidth: 0 }}>
          <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: "13px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
            <p style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{portalLabel}</p>
            <div style={{ width: 30, height: 30, background: T.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: T.green, fontSize: 11 }}>{initials}</div>
          </div>
          <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>{render()}</div>
        </main>
      </div>
      <Toast msg={toastMsg} />
    </>
  );
}
