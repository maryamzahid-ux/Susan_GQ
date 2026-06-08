import { useState, useEffect, useCallback } from "react";
import { T, ORGS as SEED_ORGS, INDIVIDUALS as SEED_IND } from "../lib/data.js";
import { getAllUsers, addUserByAdmin, addOrgByAdmin, updateUser, deleteUser, getOrgs } from "../lib/auth.js";
import { gqBand, orgGQBand, ORG_DIMENSIONS } from "../lib/gq.js";
import { GQRing, Badge, ProgressBar, StatCard, Card, Btn, Modal } from "../components/ui.jsx";

//  helpers 
const T2 = { ...T };
const fmtDate = (ts) => ts ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const initials = (name = "") => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
const scoreColor = (s) => s >= 85 ? T.greenLight : s >= 70 ? T.gold : s >= 50 ? "#D4A847" : "#C0392B";

// Merge real localStorage users with seeded demo data so the panel always has content
function useLiveData() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const rawUsers = getAllUsers();

  // seed demo individuals if store is empty of ind/org records
  const hasReal = rawUsers.some((u) => u.role === "ind" || u.role === "org");
  const individuals = hasReal
    ? rawUsers.filter((u) => u.role === "ind")
    : SEED_IND.map((u) => ({ ...u, email: `${u.name.toLowerCase().replace(/ /g, ".")}@demo.com`, role: "ind", status: "active", createdAt: Date.now() - 1e9 }));

  const orgUsers = hasReal
    ? rawUsers.filter((u) => u.role === "org")
    : SEED_ORGS.map((o) => ({ name: o.name, org: o.name, email: `admin@${o.name.toLowerCase().replace(/ /g, "")}.com`, role: "org", status: "active", gqAvg: o.gqAvg, users: o.users, progress: o.progress, license: o.license, createdAt: Date.now() - 1e9 }));

  return { individuals, orgUsers, rawUsers, refresh };
}

//  field component 
function Field({ label, value, onChange, type = "text", placeholder, required, options }) {
  const base = { width: "100%", border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 13px", fontSize: 13, background: T.ivory, outline: "none", color: T.charcoal, fontFamily: "'DM Sans',sans-serif" };
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.charcoal, display: "block", marginBottom: 5 }}>
        {label}{required && <span style={{ color: T.gold }}> *</span>}
      </label>
      {options ? (
        <select value={value} onChange={onChange} style={base}>
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3}
          style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />
      )}
    </div>
  );
}

//  Add Individual Modal 
function AddIndividualModal({ open, onClose, onSaved, toast }) {
  const blank = { name: "", email: "", jobTitle: "", org: "", notes: "" };
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    setSaving(true); setErr("");
    setTimeout(() => {
      const res = addUserByAdmin({ ...form, role: "ind" });
      setSaving(false);
      if (res.error) { setErr(res.error); return; }
      toast(` ${form.name} added — temp password: Welcome1!`);
      setForm(blank);
      onSaved();
      onClose();
    }, 400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Individual" width={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="Jane Leader" required />
          <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Job Title" value={form.jobTitle} onChange={set("jobTitle")} placeholder="VP Operations" />
          <Field label="Organization (optional)" value={form.org} onChange={set("org")} placeholder="Harley-Davidson" />
        </div>
        <Field label="Notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Context, referral source, coaching goals…" />
        {err && <p style={{ fontSize: 13, color: T.danger, background: "#FBEAE8", padding: "9px 12px", borderRadius: 8 }}>{err}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Add Individual →"}</Btn>
        </div>
        <p style={{ fontSize: 11, color: T.muted }}>A welcome email (demo) will be sent. Temporary password: <code>Welcome1!</code></p>
      </div>
    </Modal>
  );
}

//  Add Organization Modal 
function AddOrgModal({ open, onClose, onSaved, toast }) {
  const blank = { orgName: "", adminName: "", adminEmail: "", license: "Starter", notes: "" };
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    setSaving(true); setErr("");
    setTimeout(() => {
      const res = addOrgByAdmin(form);
      setSaving(false);
      if (res.error) { setErr(res.error); return; }
      toast(` ${form.orgName} added — temp password: Welcome1!`);
      setForm(blank);
      onSaved();
      onClose();
    }, 400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Organization" width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Organization Name" value={form.orgName} onChange={set("orgName")} placeholder="Harley-Davidson" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Admin Contact Name" value={form.adminName} onChange={set("adminName")} placeholder="Jane Smith" required />
          <Field label="Admin Email" type="email" value={form.adminEmail} onChange={set("adminEmail")} placeholder="jane@company.com" required />
        </div>
        <Field label="License Type" value={form.license} onChange={set("license")} options={[
          { v: "Starter", l: "Starter — up to 15 users" },
          { v: "Professional", l: "Professional — up to 50 users" },
          { v: "Enterprise", l: "Enterprise — unlimited users" },
        ]} />
        <Field label="Notes / Context" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Source, referral, special terms…" />
        {err && <p style={{ fontSize: 13, color: T.danger, background: "#FBEAE8", padding: "9px 12px", borderRadius: 8 }}>{err}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Add Organization →"}</Btn>
        </div>
      </div>
    </Modal>
  );
}

//  Individual detail drawer 
function IndividualDrawer({ user, open, onClose, onSaved, toast }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => { if (user) setForm({ name: user.name, jobTitle: user.jobTitle || "", notes: user.notes || "", status: user.status || "active" }); }, [user]);

  if (!user) return null;
  const score = user.gq?.overall ?? user.gqScore ?? null;
  const band = score !== null ? gqBand(score) : null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    updateUser(user.email, form);
    toast("Profile updated");
    setEditing(false);
    onSaved();
  };
  const del = () => {
    deleteUser(user.email);
    toast(`${user.name} removed`);
    onSaved();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Individual Profile" width={540}>
      {/* Hero */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, padding: "16px", background: T.ivory, borderRadius: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.green, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{initials(user.name)}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</p>
          <p style={{ fontSize: 13, color: T.muted }}>{user.jobTitle || "—"} · {user.email}</p>
          <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Joined {fmtDate(user.createdAt)} · {user.sessions || 0} sessions</p>
        </div>
        {score !== null && <GQRing score={score} size={64} stroke={5} />}
      </div>

      {/* GQ summary */}
      {score !== null ? (
        <div style={{ background: T.goldPale, borderRadius: 10, padding: "12px 14px", marginBottom: 20, borderLeft: `3px solid ${T.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontWeight: 600, color: band.color, fontSize: 14 }}>{band.label}</p>
            <Badge label={`GQ ${score}`} color={T.green} bg={T.white} />
          </div>
          {user.gq?.byCenter && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[[" Gut", "gut"], [" Heart", "heart"], [" Head", "head"], [" Intuition", "intuition"]].map(([lbl, k]) => (
                <div key={k}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: T.muted }}>{lbl}</span>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{user.gq.byCenter[k]}</span>
                  </div>
                  <ProgressBar pct={user.gq.byCenter[k]} color={scoreColor(user.gq.byCenter[k])} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: T.ivoryDark, borderRadius: 10, padding: "12px 14px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: T.muted }}>Assessment not yet taken</p>
        </div>
      )}

      {/* Editable fields */}
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <Field label="Name" value={form.name} onChange={set("name")} />
          <Field label="Job Title" value={form.jobTitle} onChange={set("jobTitle")} />
          <Field label="Status" value={form.status} onChange={set("status")} options={[{ v: "invited", l: "Invited" }, { v: "active", l: "Active" }, { v: "inactive", l: "Inactive" }]} />
          <Field label="Notes" type="textarea" value={form.notes} onChange={set("notes")} placeholder="Coaching notes, goals…" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save}>Save Changes</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {user.notes && <div style={{ background: T.ivory, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}><p style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{user.notes}</p></div>}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Btn>
            <Btn variant="secondary" onClick={() => toast("Invite re-sent (demo)")}>Resend Invite</Btn>
            <Btn variant="secondary" onClick={() => toast("GQ report downloaded (demo)")}>Export GQ Report</Btn>
          </div>
        </div>
      )}

      {/* Danger zone */}
      {!confirmDel ? (
        <button onClick={() => setConfirmDel(true)} style={{ fontSize: 12, color: T.danger, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}>Remove user…</button>
      ) : (
        <div style={{ background: "#FBEAE8", borderRadius: 8, padding: "12px", display: "flex", gap: 10, alignItems: "center" }}>
          <p style={{ fontSize: 13, color: T.danger, flex: 1 }}>Remove {user.name}? This cannot be undone.</p>
          <Btn variant="danger" style={{ padding: "7px 14px" }} onClick={del}>Remove</Btn>
          <Btn variant="ghost" style={{ padding: "7px 14px" }} onClick={() => setConfirmDel(false)}>Cancel</Btn>
        </div>
      )}
    </Modal>
  );
}

//  Org detail drawer 
function OrgDrawer({ org, open, onClose, toast }) {
  if (!org) return null;
  const score = org.gq?.overall ?? org.gqAvg ?? null;
  const band = score !== null ? orgGQBand(score) : null;

  return (
    <Modal open={open} onClose={onClose} title="Organization Profile" width={580}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${T.green},${T.greenMid})`, borderRadius: 12, padding: "20px", marginBottom: 20, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 18, color: T.white }}>{org.name || org.org}</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{org.license || "Starter"} license · {org.users || org.members?.length || 0} users</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Admin: {org.email} · Joined {fmtDate(org.createdAt)}</p>
        </div>
        {score !== null && <GQRing score={score} size={72} stroke={5} />}
      </div>

      {/* Org GQ */}
      {score !== null && band && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Organizational GQ Assessment</p>
          <div style={{ background: T.goldPale, borderRadius: 10, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${T.gold}` }}>
            <p style={{ fontWeight: 600, color: band.color, fontSize: 14, marginBottom: 4 }}>{band.label}</p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{band.note}</p>
          </div>
          {org.gq?.byDim && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ORG_DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: T.muted }}>{d.icon} {d.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{org.gq.byDim[d.key]}</span>
                  </div>
                  <ProgressBar pct={org.gq.byDim[d.key]} color={scoreColor(org.gq.byDim[d.key])} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!score && (
        <div style={{ background: T.ivoryDark, borderRadius: 10, padding: "14px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: T.muted }}>Org GQ Assessment not yet completed</p>
        </div>
      )}

      {/* Members */}
      {org.members?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Team Members ({org.members.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {org.members.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: T.ivory, borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.green }}>{initials(m.name)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: T.muted }}>{m.email}</p>
                </div>
                {m.gq?.overall && <GQRing score={m.gq.overall} size={36} stroke={3} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn onClick={() => toast("GQ report sent to org admin (demo)")}>Send GQ Report</Btn>
        <Btn variant="secondary" onClick={() => toast("Invite link copied (demo)")}>Copy Invite Link</Btn>
        <Btn variant="secondary" onClick={() => toast("Exporting org data…")}>Export Data</Btn>
        <Btn variant="ghost" onClick={() => toast("License management opened")}>Manage License</Btn>
      </div>
    </Modal>
  );
}

// 
// MAIN ADMIN PANEL — tabs: Overview · Organizations · Individuals · Assessments · Materials · Analytics · Settings
// 
export function AdminPanel({ toast }) {
  const [tab, setTab] = useState("overview");
  const { individuals, orgUsers, refresh } = useLiveData();
  const [addIndOpen, setAddIndOpen] = useState(false);
  const [addOrgOpen, setAddOrgOpen] = useState(false);
  const [selInd, setSelInd] = useState(null);
  const [selOrg, setSelOrg] = useState(null);
  const [indSearch, setIndSearch] = useState("");
  const [orgSearch, setOrgSearch] = useState("");
  const [indFilter, setIndFilter] = useState("all"); // all | assessed | not-assessed | certified

  const TABS = [
    ["overview", "Overview"], ["orgs", "Organizations"],
    ["individuals", "Individuals"], ["assessments", "Assessments"],
    ["analytics", "Analytics"], ["settings", "Settings"],
  ];

  // derived counts
  const assessed = individuals.filter((u) => u.gq?.overall);
  const certified = individuals.filter((u) => u.certified);
  const avgGQ = assessed.length ? Math.round(assessed.reduce((s, u) => s + (u.gq?.overall ?? u.gqScore ?? 0), 0) / assessed.length) : "—";
  const orgAssessed = orgUsers.filter((u) => u.gq?.byDim);

  const filteredInd = individuals.filter((u) => {
    const matchSearch = !indSearch || u.name?.toLowerCase().includes(indSearch.toLowerCase()) || u.email?.toLowerCase().includes(indSearch.toLowerCase());
    const matchFilter = indFilter === "all" || (indFilter === "assessed" && u.gq?.overall) || (indFilter === "not-assessed" && !u.gq?.overall) || (indFilter === "certified" && u.certified);
    return matchSearch && matchFilter;
  });

  const filteredOrgs = orgUsers.filter((u) => !orgSearch || (u.org || u.name)?.toLowerCase().includes(orgSearch.toLowerCase()));

  return (
    <div>
      {/* Modals */}
      <AddIndividualModal open={addIndOpen} onClose={() => setAddIndOpen(false)} onSaved={refresh} toast={toast} />
      <AddOrgModal open={addOrgOpen} onClose={() => setAddOrgOpen(false)} onSaved={refresh} toast={toast} />
      <IndividualDrawer user={selInd} open={!!selInd} onClose={() => setSelInd(null)} onSaved={refresh} toast={toast} />
      <OrgDrawer org={selOrg} open={!!selOrg} onClose={() => setSelOrg(null)} toast={toast} />

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: 6, flexWrap: "wrap" }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: tab === id ? T.green : "transparent", color: tab === id ? T.white : T.muted, fontSize: 13, fontWeight: tab === id ? 600 : 400, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/*  OVERVIEW  */}
      {tab === "overview" && (
        <div>
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: T.green, marginBottom: 4 }}>Welcome back, Susan </h1>
            <p style={{ color: T.muted, fontSize: 13 }}>Your Gut Intelligence® platform — live dashboard</p>
          </div>

          {/* KPI row */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard label="Organizations" value={orgUsers.length} sub={`${orgAssessed.length} completed org GQ`} icon="" />
            <StatCard label="Individuals" value={individuals.length} sub={`${assessed.length} assessed`} icon="" />
            <StatCard label="Avg GQ Score" value={avgGQ} sub={assessed.length ? `across ${assessed.length} assessments` : "no assessments yet"} icon="" />
            <StatCard label="Certifications" value={certified.length} sub="issued total" icon="" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Assessment progress */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Assessment Progress</h3>
                <Badge label="Live" color={T.success} bg="#E8F4EE" />
              </div>
              <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
                {[
                  { label: "Individuals Assessed", n: assessed.length, total: Math.max(individuals.length, 1), color: T.greenLight },
                  { label: "Orgs Assessed", n: orgAssessed.length, total: Math.max(orgUsers.length, 1), color: T.gold },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: T.muted }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.n}/{s.total}</span>
                    </div>
                    <ProgressBar pct={(s.n / s.total) * 100} color={s.color} />
                  </div>
                ))}
              </div>

              {/* GQ band distribution */}
              <p style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>Individual GQ Distribution</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "Cheetah (85+)", count: assessed.filter(u => (u.gq?.overall ?? u.gqScore) >= 85).length, color: T.greenLight },
                  { label: "Strong (70–84)", count: assessed.filter(u => { const s = u.gq?.overall ?? u.gqScore; return s >= 70 && s < 85; }).length, color: T.gold },
                  { label: "Emerging (50–69)", count: assessed.filter(u => { const s = u.gq?.overall ?? u.gqScore; return s >= 50 && s < 70; }).length, color: "#D4A847" },
                  { label: "Reactive (<50)", count: assessed.filter(u => (u.gq?.overall ?? u.gqScore) < 50).length, color: "#C0392B" },
                ].map((b, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ height: 40, background: T.ivoryDark, borderRadius: 6, overflow: "hidden", marginBottom: 4, display: "flex", alignItems: "flex-end" }}>
                      <div style={{ width: "100%", background: b.color, height: `${Math.max(10, (b.count / Math.max(assessed.length, 1)) * 100)}%`, borderRadius: "4px 4px 0 0" }} />
                    </div>
                    <p style={{ fontSize: 10, color: T.muted, lineHeight: 1.3 }}>{b.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.count}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick actions */}
            <Card>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
              {[
                { label: "Add Individual", icon: "", action: () => setAddIndOpen(true) },
                { label: "Add Organization", icon: "", action: () => setAddOrgOpen(true) },
                { label: "View Assessments", icon: "", action: () => setTab("assessments") },
                { label: "Export All Data", icon: "", action: () => toast("Exporting platform data…") },
                { label: "Send Bulk Report", icon: "", action: () => toast("Bulk GQ report queued (demo)") },
              ].map((a, i) => (
                <button key={i} onClick={a.action}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.white, marginBottom: 8, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>{a.label}</span>
                  <span style={{ marginLeft: "auto", color: T.muted }}>→</span>
                </button>
              ))}
            </Card>
          </div>

          {/* Recent signups */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Registrations</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setTab("individuals")}>All Individuals</Btn>
                <Btn variant="secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setTab("orgs")}>All Orgs</Btn>
              </div>
            </div>
            {[...individuals, ...orgUsers].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6).map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.role === "org" ? T.goldPale : T.ivoryDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{u.role === "org" ? "" : initials(u.name)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{u.role === "org" ? (u.org || u.name) : u.name}</p>
                  <p style={{ fontSize: 11, color: T.muted }}>{u.email} · {fmtDate(u.createdAt)}</p>
                </div>
                <Badge label={u.role === "org" ? "Organization" : "Individual"} color={u.role === "org" ? T.gold : T.green} bg={u.role === "org" ? T.goldPale : "#E8F4EE"} />
                <Badge label={u.gq ? "Assessed" : "Pending"} color={u.gq ? T.success : T.muted} bg={u.gq ? "#E8F4EE" : T.ivoryDark} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/*  ORGANIZATIONS  */}
      {tab === "orgs" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: T.green }}>Organizations</h2>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{orgUsers.length} organizations registered</p>
            </div>
            <Btn onClick={() => setAddOrgOpen(true)}>+ Add Organization</Btn>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <input value={orgSearch} onChange={(e) => setOrgSearch(e.target.value)} placeholder="Search organizations…"
              style={{ border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", fontSize: 13, background: T.white, outline: "none", width: 280 }} />
          </div>

          {filteredOrgs.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}></p>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: T.green, marginBottom: 8 }}>No organizations yet</h3>
              <p style={{ fontSize: 14, color: T.muted, marginBottom: 20 }}>Add your first organization to get started.</p>
              <Btn onClick={() => setAddOrgOpen(true)}>+ Add Organization</Btn>
            </Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filteredOrgs.map((u, i) => {
                const score = u.gq?.overall ?? u.gqAvg ?? null;
                const prog = u.progress ?? 0;
                const license = u.notes?.match(/License: (\w+)/)?.[1] ?? u.license ?? "Starter";
                return (
                  <div key={i} onClick={() => setSelOrg(u)}
                    style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", cursor: "pointer", transition: "box-shadow 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,67,50,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}></div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 15 }}>{u.org || u.name}</p>
                          <p style={{ fontSize: 11, color: T.muted }}>{u.members?.length ?? u.users ?? 0} users · {fmtDate(u.createdAt)}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                        <Badge label={license} color={T.green} bg={T.goldPale} />
                        <Badge label={u.gq ? "GQ Done" : "Pending"} color={u.gq ? T.success : T.muted} bg={u.gq ? "#E8F4EE" : T.ivoryDark} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
                      <div><p style={{ fontSize: 11, color: T.muted }}>Org GQ Score</p><p style={{ fontSize: 22, fontWeight: 700, color: score !== null ? scoreColor(score) : T.border }}>{score ?? "—"}</p></div>
                      <div style={{ flex: 1 }}><p style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Program Progress</p><ProgressBar pct={prog} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/*  INDIVIDUALS  */}
      {tab === "individuals" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: T.green }}>Individuals</h2>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{individuals.length} registered · {assessed.length} assessed · {certified.length} certified</p>
            </div>
            <Btn onClick={() => setAddIndOpen(true)}>+ Add Individual</Btn>
          </div>

          {/* Search + filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input value={indSearch} onChange={(e) => setIndSearch(e.target.value)} placeholder="Search by name or email…"
              style={{ border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", fontSize: 13, background: T.white, outline: "none", width: 260 }} />
            {["all", "assessed", "not-assessed", "certified"].map((f) => (
              <button key={f} onClick={() => setIndFilter(f)}
                style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${indFilter === f ? T.green : T.border}`, background: indFilter === f ? T.green : T.white, color: indFilter === f ? T.white : T.muted, fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
                {f.replace("-", " ")}
              </button>
            ))}
          </div>

          {filteredInd.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}></p>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: T.green, marginBottom: 8 }}>No individuals found</h3>
              <Btn onClick={() => setAddIndOpen(true)}>+ Add Individual</Btn>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px 80px", gap: 12, padding: "8px 16px" }}>
                {["Name / Email", "Role / Org", "Status", "GQ Score", "Sessions", "Actions"].map((h) => (
                  <p key={h} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</p>
                ))}
              </div>
              {filteredInd.map((u, i) => {
                const score = u.gq?.overall ?? u.gqScore ?? null;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px 80px", gap: 12, padding: "12px 16px", background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.green, flexShrink: 0 }}>{initials(u.name)}</div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: T.muted }}>{u.email}</p>
                      </div>
                    </div>
                    <div><p style={{ fontSize: 12 }}>{u.jobTitle || u.role || "—"}</p><p style={{ fontSize: 11, color: T.muted }}>{u.org || "—"}</p></div>
                    <div>
                      <Badge label={u.status || "active"} color={u.status === "invited" ? T.gold : u.status === "inactive" ? T.muted : T.success} bg={u.status === "invited" ? T.goldPale : u.status === "inactive" ? T.ivoryDark : "#E8F4EE"} />
                      {u.certified && <div style={{ marginTop: 4 }}><Badge label="Certified " color={T.green} bg={T.goldPale} /></div>}
                    </div>
                    <div>
                      {score !== null ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <GQRing score={score} size={40} stroke={3} />
                          <div>
                            <p style={{ fontSize: 10, color: T.muted, lineHeight: 1.3 }}>{gqBand(score).label}</p>
                          </div>
                        </div>
                      ) : <p style={{ fontSize: 12, color: T.muted }}>Not assessed</p>}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500, textAlign: "center" }}>{u.sessions ?? 0}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelInd(u)} style={{ background: T.goldPale, border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, color: T.green, cursor: "pointer", fontWeight: 500 }}>View</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/*  ASSESSMENTS  */}
      {tab === "assessments" && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: T.green, marginBottom: 4 }}>Assessments</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>All GQ assessment results across individuals and organizations</p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard label="Ind. Assessments" value={assessed.length} sub={`of ${individuals.length} total`} icon="" />
            <StatCard label="Org Assessments" value={orgAssessed.length} sub={`of ${orgUsers.length} orgs`} icon="" />
            <StatCard label="Avg Individual GQ" value={avgGQ} sub="across all scores" icon="" />
            <StatCard label="Cheetah Achievers" value={assessed.filter(u => (u.gq?.overall ?? u.gqScore) >= 85).length} sub="score ≥ 85" icon="" />
          </div>

          {/* Individual results table */}
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Individual GQ Results</h3>
            {assessed.length === 0 ? (
              <p style={{ fontSize: 13, color: T.muted, textAlign: "center", padding: "24px 0" }}>No assessments completed yet</p>
            ) : (
              assessed.map((u, i) => {
                const score = u.gq?.overall ?? u.gqScore;
                const band = gqBand(score);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < assessed.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.green, flexShrink: 0 }}>{initials(u.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: band.color }}>{score} — {band.label}</p>
                      </div>
                      {u.gq?.byCenter && (
                        <div style={{ display: "flex", gap: 16 }}>
                          {[["", "gut"], ["", "heart"], ["", "head"], ["", "intuition"]].map(([ic, k]) => (
                            <span key={k} style={{ fontSize: 11, color: T.muted }}>{ic} {u.gq.byCenter[k]}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setSelInd(u)} style={{ background: T.goldPale, border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, color: T.green, cursor: "pointer" }}>Detail →</button>
                  </div>
                );
              })
            )}
          </Card>

          {/* Org GQ results */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Organizational GQ Results</h3>
            {orgAssessed.length === 0 ? (
              <p style={{ fontSize: 13, color: T.muted, textAlign: "center", padding: "24px 0" }}>No org assessments completed yet</p>
            ) : (
              orgAssessed.map((u, i) => {
                const score = u.gq?.overall;
                const band = orgGQBand(score);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < orgAssessed.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{u.org || u.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: band.color }}>{score} — {band.label}</p>
                      </div>
                      {u.gq?.byDim && (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {ORG_DIMENSIONS.slice(0, 4).map((d) => (
                            <span key={d.key} style={{ fontSize: 11, color: T.muted }}>{d.icon} {u.gq.byDim[d.key]}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setSelOrg(u)} style={{ background: T.goldPale, border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, color: T.green, cursor: "pointer" }}>Detail →</button>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      )}

      {/*  ANALYTICS  */}
      {tab === "analytics" && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: T.green, marginBottom: 4 }}>Analytics</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>Platform-wide performance metrics</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard label="Total Sessions" value="1,284" sub="this quarter" icon="" />
            <StatCard label="Completion Rate" value="78%" sub="↑ 6% vs last Q" icon="" />
            <StatCard label="Avg Sessions/User" value="8.7" sub="target: 10" icon="" />
            <StatCard label="NPS Score" value="72" sub="excellent" icon="" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>GQ Score Distribution</h3>
              {[["Cheetah (85+)", assessed.filter(u => (u.gq?.overall ?? u.gqScore ?? 0) >= 85).length, T.greenLight],
                ["Strong (70–84)", assessed.filter(u => { const s = u.gq?.overall ?? u.gqScore ?? 0; return s >= 70 && s < 85; }).length, T.gold],
                ["Emerging (50–69)", assessed.filter(u => { const s = u.gq?.overall ?? u.gqScore ?? 0; return s >= 50 && s < 70; }).length, "#D4A847"],
                ["Reactive (<50)", assessed.filter(u => (u.gq?.overall ?? u.gqScore ?? 0) < 50).length, "#C0392B"]
              ].map(([lbl, n, color], i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13 }}>{lbl}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>{n} users</span>
                  </div>
                  <ProgressBar pct={assessed.length ? (n / assessed.length) * 100 : 0} color={color} />
                </div>
              ))}
            </Card>
            <Card>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Top Library Modules</h3>
              {[["SHIFT Foundations", 94], ["S.T.O.P. Technique", 88], ["Gut-Brain Axis", 76], ["GQ Architecture", 61], ["Yogi Executive Meditation", 54]].map(([n, p], i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 13 }}>{n}</span><span style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>{p}%</span></div>
                  <ProgressBar pct={p} color={T.gold} />
                </div>
              ))}
            </Card>
          </div>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Organization Progress</h3>
            {orgUsers.map((u, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{u.org || u.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.green }}>{u.progress ?? 0}%</span>
                </div>
                <ProgressBar pct={u.progress ?? 0} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/*  SETTINGS  */}
      {tab === "settings" && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: T.green, marginBottom: 4 }}>Platform Settings</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>Configure your GQ Platform</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { title: "Notification Preferences", desc: "Email alerts when new users register or complete assessments", action: "Configure", icon: "" },
              { title: "License Management", desc: "View and upgrade organization licenses", action: "Manage Licenses", icon: "" },
              { title: "Certification Tracks", desc: "Edit GQ certification requirements and criteria", action: "Edit Tracks", icon: "" },
              { title: "Assessment Questions", desc: "Review and update individual & organizational GQ questions", action: "Review Questions", icon: "" },
              { title: "Brand & Content", desc: "Update platform branding, copy, and Susan's featured content", action: "Edit Content", icon: "" },
              { title: "Export Platform Data", desc: "Download all users, scores, and activity as CSV", action: "Export CSV", icon: "" },
            ].map((s, i) => (
              <Card key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: T.muted }}>{s.desc}</p>
                </div>
                <Btn variant="secondary" style={{ fontSize: 12, padding: "7px 14px", flexShrink: 0 }} onClick={() => toast(`${s.title} — opening (demo)…`)}>{s.action}</Btn>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
