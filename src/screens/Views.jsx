import { useState } from "react";
import { T, GQ_CENTERS, STOP_TECHNIQUE, SHIFT_EFFECT, BOOKS, ARTICLES, PROGRAMS, MATERIALS, ORGS, INDIVIDUALS, CERT_TRACKS } from "../lib/data.js";
import { GQRing, Badge, ProgressBar, StatCard, Card, Btn, Modal } from "../components/ui.jsx";
import { gqBand, orgGQBand, ORG_DIMENSIONS } from "../lib/gq.js";

const matIcon = (t) => (t === "video" ? "🎬" : t === "pdf" ? "📄" : "🎧");

// ════════════ ADMIN ════════════
export function AdminOverview() {
  return (
    <div>
      <Header title="Welcome back, Susan 👋" sub="Your Gut Intelligence® platform at a glance" />
      <Row>
        <StatCard label="Organizations" value="4" sub="2 enterprise licenses" icon="🏢" />
        <StatCard label="Individuals" value="147" sub="+12 this month" icon="👤" />
        <StatCard label="Avg GQ Score" value="76" sub="↑ 4 pts this quarter" icon="⚡" />
        <StatCard label="Certifications" value="38" sub="issued total" icon="🎓" />
      </Row>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card>
          <H3>Top Performing Organizations</H3>
          {ORGS.map((o) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Avatar text="🏢" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{o.name}</span>
                  <span style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>{o.gqAvg} GQ</span>
                </div>
                <ProgressBar pct={o.gqAvg} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <H3>Recent Activity</H3>
          {[
            { t: "Alex Rivera completed GQ Practitioner (L2)", time: "2h ago", icon: "🎓" },
            { t: "Harley-Davidson team logged 5 new sessions", time: "4h ago", icon: "📊" },
            { t: "New material: 'The Gut-Brain Axis' video", time: "Yesterday", icon: "🎬" },
            { t: "Lisa Fontaine reached Cheetah — Self-Mastery", time: "2d ago", icon: "⭐" },
            { t: "GMR Marketing org score improved +8", time: "3d ago", icon: "📈" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div><p style={{ fontSize: 13, lineHeight: 1.4 }}>{a.t}</p><p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{a.time}</p></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export function AdminOrgs({ toast }) {
  const [sel, setSel] = useState(null);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Header title="Organizations" sub="Manage licensed organizations and their GQ progress" inline />
        <Btn onClick={() => toast("New organization invite link copied to clipboard")}>+ Add Organization</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ORGS.map((o) => (
          <div key={o.id} onClick={() => setSel(sel === o.id ? null : o.id)}
            style={{ background: T.white, border: `1.5px solid ${sel === o.id ? T.gold : T.border}`, borderRadius: 14, padding: "20px 22px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar text="🏢" size={40} />
                <div><p style={{ fontWeight: 600, fontSize: 15 }}>{o.name}</p><p style={{ fontSize: 11, color: T.muted }}>{o.users} users · Joined {o.joined}</p></div>
              </div>
              <Badge label={o.license} color={T.green} bg={T.goldPale} />
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
              <div><p style={{ fontSize: 11, color: T.muted }}>Avg GQ Score</p><p style={{ fontSize: 20, fontWeight: 700, color: T.gold }}>{o.gqAvg}</p></div>
              <div><p style={{ fontSize: 11, color: T.muted }}>Program Progress</p><p style={{ fontSize: 20, fontWeight: 700, color: T.green }}>{o.progress}%</p></div>
            </div>
            <ProgressBar pct={o.progress} />
            {sel === o.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={(e) => { e.stopPropagation(); toast(`Opening ${o.name} detailed report…`); }}>View Details</Btn>
                <Btn variant="secondary" onClick={(e) => { e.stopPropagation(); toast(`GQ report sent to ${o.name} admin`); }}>Send Report</Btn>
                <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); toast("Opening user management…"); }}>Manage Users</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminIndividuals() {
  return (
    <div>
      <Header title="Individual Users" sub="All individual users across the platform" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {INDIVIDUALS.map((u) => (
          <Card key={u.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar text={u.name.split(" ").map((n) => n[0]).join("")} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 3 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</p>
                {u.certified && <Badge label="Certified" color={T.success} bg="#E8F4EE" />}
              </div>
              <p style={{ fontSize: 12, color: T.muted }}>{u.role} · {u.sessions} sessions · Last active {u.lastActive}</p>
            </div>
            <GQRing score={u.gqScore} size={56} />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminMaterials({ toast }) {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState(MATERIALS);
  const addDemo = (type) => {
    const id = Math.max(...items.map((i) => i.id)) + 1;
    setItems([{ id, type, title: `New ${type} — untitled`, duration: type !== "pdf" ? "—" : undefined, pages: type === "pdf" ? 1 : undefined, category: "Core", desc: "Newly uploaded material (demo)." }, ...items]);
    setUploading(false);
    toast(`${type.toUpperCase()} uploaded to the library`);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Header title="Coaching Library" sub="Upload and manage all coaching materials" inline />
        <Btn onClick={() => setUploading(!uploading)}>+ Upload Material</Btn>
      </div>
      {uploading && (
        <div style={{ background: T.white, border: `1.5px dashed ${T.gold}`, borderRadius: 14, padding: "32px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
          <p style={{ fontWeight: 600, color: T.green, marginBottom: 6 }}>Drop files here or pick a type to upload</p>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Supports MP4, PDF, MP3, DOCX</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[["video", "Video"], ["pdf", "PDF"], ["audio", "Audio"]].map(([t, l]) => (
              <Btn key={t} variant="secondary" onClick={() => addDemo(t)}>Upload {l}</Btn>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((m) => (
          <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
            <Avatar text={matIcon(m.type)} size={44} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{m.title}</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Badge label={m.category} color={T.green} bg={T.goldPale} />
                <p style={{ fontSize: 12, color: T.muted }}>{m.duration || (m.pages ? `${m.pages} pages` : "")}</p>
              </div>
            </div>
            <Btn variant="ghost" onClick={() => toast("Edit panel opened")}>Edit</Btn>
            <Btn variant="danger" onClick={() => { setItems(items.filter((x) => x.id !== m.id)); toast("Material removed"); }}>Remove</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const dist = [{ r: "0-40", v: 8 }, { r: "41-50", v: 15 }, { r: "51-60", v: 22 }, { r: "61-70", v: 38 }, { r: "71-80", v: 42 }, { r: "81-90", v: 28 }, { r: "91-100", v: 12 }];
  const max = Math.max(...dist.map((d) => d.v));
  return (
    <div>
      <Header title="Analytics" sub="Platform-wide performance metrics and insights" />
      <Row>
        <StatCard label="Total Sessions" value="1,284" sub="this quarter" icon="🧠" />
        <StatCard label="Completion Rate" value="78%" sub="↑ 6% vs last Q" icon="✅" />
        <StatCard label="Avg Sessions/User" value="8.7" sub="target: 10" icon="🔄" />
        <StatCard label="NPS" value="72" sub="excellent range" icon="⭐" />
      </Row>
      <Card style={{ marginTop: 16 }}>
        <H3>GQ Score Distribution — All Users</H3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
          {dist.map((b, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <p style={{ fontSize: 10, color: T.muted, fontWeight: 500 }}>{b.v}</p>
              <div style={{ width: "100%", background: i < 2 ? T.border : i < 4 ? T.goldLight : T.greenLight, borderRadius: "4px 4px 0 0", height: `${(b.v / max) * 100}%`, transition: "height 1s ease" }} />
              <p style={{ fontSize: 9, color: T.muted }}>{b.r}</p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card>
          <H3>Top Modules by Engagement</H3>
          {[["SHIFT Foundations", 94], ["S.T.O.P. Technique", 88], ["Gut-Brain Axis", 76], ["GQ Architecture", 61]].map(([n, p], i) => (
            <Meter key={i} name={n} pct={p} color={T.gold} />
          ))}
        </Card>
        <Card>
          <H3>Org Progress Comparison</H3>
          {ORGS.map((o) => <Meter key={o.id} name={o.name} pct={o.progress} />)}
        </Card>
      </div>
    </div>
  );
}

// ════════════ ORG ════════════
export function OrgDashboard({ gq, orgGq, goTo }) {
  const orgScore = orgGq?.overall ?? null;
  const orgBand = orgScore !== null ? orgGQBand(orgScore) : null;

  return (
    <div>
      <Header title="Organization Dashboard" sub="Team GQ performance overview" />
      <Row>
        <StatCard label="Team Members" value="42" sub="3 pending invites" icon="👥" />
        <StatCard label="Team Avg GQ" value={gq?.overall ?? "—"} sub="individual assessments" icon="⚡" />
        <StatCard label="Sessions This Week" value="18" sub="across all members" icon="🧠" />
        <StatCard label="Certified" value="9" sub="21% of team" icon="🎓" />
      </Row>

      {/* Org GQ Assessment CTA or results */}
      {!orgGq ? (
        <Card style={{ marginTop: 16, display: "flex", gap: 24, alignItems: "center", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, border: "none" }}>
          <div style={{ fontSize: 48 }}>🏢</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: T.goldLight, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>ORGANIZATIONAL GQ ASSESSMENT</p>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.white, marginBottom: 8 }}>Measure your organization's Gut Intelligence®</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 16 }}>12 questions across 6 organizational dimensions: gut-alert culture, emotional safety, strategic field, aligned intuition, role fit, and communication clarity.</p>
            <Btn variant="gold" onClick={() => goTo("org-assessment")}>Take the Org Assessment →</Btn>
          </div>
        </Card>
      ) : (
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <H3>Organizational GQ Score</H3>
              <p style={{ fontSize: 12, color: T.muted, marginTop: -10 }}>Across 6 GQ Architecture dimensions</p>
            </div>
            <Btn variant="secondary" onClick={() => goTo("org-assessment")} style={{ fontSize: 12, padding: "7px 14px" }}>Retake →</Btn>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <GQRing score={orgScore} size={90} stroke={6} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: orgBand.color, fontWeight: 600, marginBottom: 6 }}>{orgBand.label}</p>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>{orgBand.note}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ORG_DIMENSIONS.map((d) => {
                  const s = orgGq.byDim[d.key];
                  return (
                    <div key={d.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: T.muted }}>{d.icon} {d.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: s >= 70 ? T.greenLight : s >= 50 ? T.gold : "#C0392B" }}>{s}</span>
                      </div>
                      <ProgressBar pct={s} color={s >= 70 ? T.greenLight : s >= 50 ? T.gold : "#C0392B"} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <H3>Team Members — Individual GQ Scores</H3>
        {INDIVIDUALS.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <Avatar text={m.name.split(" ").map((n) => n[0]).join("")} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.gold }}>{m.gqScore}</span>
              </div>
              <ProgressBar pct={m.gqScore} />
            </div>
            {m.certified && <span style={{ fontSize: 14 }}>🎓</span>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ════════════ INDIVIDUAL ════════════
export function IndDashboard({ gq, userName, goTo }) {
  const score = gq?.overall ?? 0;
  const band = gqBand(score);
  const dims = [
    { label: "Gut-Alert", score: gq?.byCenter?.gut ?? 0, icon: "🧭" },
    { label: "Heart's Desire", score: gq?.byCenter?.heart ?? 0, icon: "💚" },
    { label: "Field of Possibilities", score: gq?.byCenter?.head ?? 0, icon: "🧠" },
    { label: "A-ha Knowing", score: gq?.byCenter?.intuition ?? 0, icon: "✨" },
  ];
  return (
    <div>
      <Header title="Your GQ Journey" sub={`${userName?.split(" ")[0] || "Your"} — personal growth dashboard`} />
      {score === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.green, marginBottom: 8 }}>Discover your Gut Intelligence® score</h3>
          <p style={{ fontSize: 14, color: T.muted, maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.6 }}>Take the 8-question assessment across your four information centers to reveal your GQ.</p>
          <Btn onClick={() => goTo("assessment")}>Take the Assessment →</Btn>
        </Card>
      ) : (
        <>
          <div style={{ background: `linear-gradient(135deg,${T.green},${T.greenMid})`, borderRadius: 16, padding: "28px", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
            <GQRing score={score} size={100} stroke={7} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Your GQ Score</p>
              <p style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{band.label}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{band.note}</p>
            </div>
          </div>
          <Row style={{ marginTop: 16 }}>
            {dims.map((a, i) => (
              <div key={i} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 130 }}>
                <p style={{ fontSize: 18, marginBottom: 6 }}>{a.icon}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: T.green }}>{a.score}</p>
                <p style={{ fontSize: 12, color: T.muted }}>{a.label}</p>
              </div>
            ))}
          </Row>
        </>
      )}
      <Card style={{ marginTop: 16 }}>
        <H3>Continue Your Learning</H3>
        {MATERIALS.slice(0, 3).map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
            <Avatar text={matIcon(m.type)} size={40} />
            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 500 }}>{m.title}</p><p style={{ fontSize: 12, color: T.muted }}>{m.duration || `${m.pages} pages`}</p></div>
            <Btn variant="secondary" onClick={() => goTo("library")}>Open →</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

export function IndJournal({ toast }) {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([
    { date: "June 1", text: "A difficult decision today about project direction. My gut-alert fired — something felt off. Used S.T.O.P.: slowed down, tuned in, observed. The misalignment was about our values, not the strategy. Clarity came fast." },
    { date: "May 28", text: "Team meeting with early signs of misalignment. Instead of reacting, I asked 'How might we understand what this resistance is telling us?' The conversation shifted completely." },
  ]);
  const save = () => { if (entry.trim()) { setEntries([{ date: "Today", text: entry }, ...entries]); setEntry(""); toast("Journal entry saved"); } };
  return (
    <div>
      <Header title="Reflection Journal" sub="Record your gut signals, aha moments, and alignment insights" />
      <Card>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.green, marginBottom: 12 }}>New Entry</p>
        <div style={{ background: T.goldPale, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>Prompt: "What gut-alert did you notice today? What was it telling you about alignment with your vision, values, and goals?"</p>
        </div>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)} rows={5} placeholder="Write freely — this is your private space for reflection…"
          style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px", fontSize: 14, color: T.charcoal, background: T.ivory, resize: "vertical", outline: "none", lineHeight: 1.7 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}><Btn onClick={save}>Save Entry</Btn></div>
      </Card>
      <div style={{ marginTop: 16 }}>
        {entries.map((e, i) => (
          <Card key={i} style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: T.gold, fontWeight: 600, marginBottom: 8 }}>📅 {e.date}</p>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{e.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ════════════ SHARED ════════════
export function GQScoreView({ userType, gq, goTo }) {
  const score = gq?.overall ?? (userType === "org" ? 74 : 0);
  if (userType !== "org" && !gq) {
    return (
      <div>
        <Header title="My GQ Score" sub="Your personal Gut Intelligence® assessment" />
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.green, marginBottom: 8 }}>You haven't taken the assessment yet</h3>
          <Btn onClick={() => goTo("assessment")}>Take the Assessment →</Btn>
        </Card>
      </div>
    );
  }
  const band = gqBand(score);
  const breakdown = GQ_CENTERS.map((c) => ({ ...c, score: gq?.byCenter?.[c.key] ?? [85, 72, 78, 76][["gut", "heart", "head", "intuition"].indexOf(c.key)] }));
  return (
    <div>
      <Header title="GQ Performance" sub={userType === "org" ? "Organization-wide Gut Intelligence® scores" : "Your Gut Intelligence® assessment results"} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <Card style={{ textAlign: "center" }}>
          <GQRing score={score} size={120} stroke={8} />
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: band.color, marginTop: 14, fontWeight: 600 }}>{band.label}</p>
          <div style={{ marginTop: 16, background: T.goldPale, borderRadius: 10, padding: "12px", borderLeft: `3px solid ${T.gold}`, textAlign: "left" }}>
            <p style={{ fontSize: 12, color: T.charcoal, lineHeight: 1.5, fontStyle: "italic" }}>{band.note}</p>
          </div>
        </Card>
        <Card>
          <H3>The Four Information Centers</H3>
          {breakdown.map((d, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div><p style={{ fontSize: 13, fontWeight: 500 }}>{d.icon} {d.label}</p><p style={{ fontSize: 11, color: T.muted }}>{d.signal}</p></div>
                <p style={{ fontSize: 16, fontWeight: 700, color: T.gold, minWidth: 30, textAlign: "right" }}>{d.score}</p>
              </div>
              <ProgressBar pct={d.score} color={d.score > 80 ? T.greenLight : T.gold} />
            </div>
          ))}
        </Card>
      </div>
      {userType !== "org" && (
        <Card style={{ marginTop: 16 }}>
          <H3>Practice the S.T.O.P. Technique</H3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {STOP_TECHNIQUE.map((s) => (
              <div key={s.letter} style={{ background: T.ivory, borderRadius: 12, padding: "16px" }}>
                <div style={{ width: 32, height: 32, background: T.green, color: T.white, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 10 }}>{s.letter}</div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function LibraryView({ toast }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const cats = ["All", "Core", "Leadership", "Practice", "Consciousness"];
  const list = filter === "All" ? MATERIALS : MATERIALS.filter((m) => m.category === filter);
  return (
    <div>
      <Header title="Coaching Library" sub="Susan K. Wehrley's curated Gut Intelligence® learning materials" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ background: filter === c ? T.green : T.white, color: filter === c ? T.white : T.muted, border: `1px solid ${filter === c ? T.green : T.border}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {list.map((m) => (
          <Card key={m.id} style={{ display: "flex", gap: 16 }}>
            <Avatar text={matIcon(m.type)} size={48} />
            <div style={{ flex: 1 }}>
              <Badge label={m.category} color={T.green} bg={T.goldPale} />
              <p style={{ fontSize: 14, fontWeight: 600, margin: "8px 0 4px", lineHeight: 1.4 }}>{m.title}</p>
              <p style={{ fontSize: 12, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>{m.desc}</p>
              <Btn full onClick={() => setActive(m)}>{m.type === "pdf" ? "Read Now →" : "Play Now →"}</Btn>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div>
            <div style={{ background: T.green, borderRadius: 12, height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16, gap: 10 }}>
              <div style={{ fontSize: 48 }}>{matIcon(active.type)}</div>
              {active.type !== "pdf" ? (
                <button onClick={() => toast("Playback started (demo)")} style={{ width: 56, height: 56, borderRadius: "50%", background: T.gold, border: "none", color: T.white, fontSize: 22, cursor: "pointer" }}>▶</button>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{active.pages} pages</p>
              )}
            </div>
            <p style={{ fontSize: 14, color: T.charcoal, lineHeight: 1.7, marginBottom: 16 }}>{active.desc}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => toast(active.type === "pdf" ? "Opening reader…" : "Playback started (demo)")}>{active.type === "pdf" ? "Open Reader" : "▶ Play"}</Btn>
              <Btn variant="secondary" onClick={() => toast("Added to your saved list")}>Save for Later</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function CertifyView({ gq, toast }) {
  const score = gq?.overall ?? 65;
  const progressFor = (i) => (i === 0 ? (score >= 60 ? 100 : 40) : i === 1 ? (score >= 70 ? 65 : 20) : 0);
  return (
    <div>
      <Header title="GQ Certification" sub="Earn your Gut Intelligence® credentials" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {CERT_TRACKS.map((c, i) => {
          const prog = progressFor(i);
          const locked = score < c.gqReq && prog === 0;
          const completed = prog === 100;
          const status = completed ? "Completed" : locked ? "Locked" : "In Progress";
          return (
            <div key={i} style={{ background: T.white, border: `1.5px solid ${completed ? T.gold : status === "In Progress" ? T.greenLight : T.border}`, borderRadius: 16, padding: "24px", opacity: locked ? 0.7 : 1 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ fontSize: 40 }}>{c.badge}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div><p style={{ fontSize: 11, color: T.gold, fontWeight: 600 }}>{c.level}</p><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: T.green }}>{c.title}</h3></div>
                    <Badge label={status} color={completed ? T.success : status === "In Progress" ? T.green : T.muted} bg={completed ? "#E8F4EE" : status === "In Progress" ? T.goldPale : T.ivoryDark} />
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.5 }}>{c.desc} · {c.modules} modules · Requires GQ ≥ {c.gqReq}</p>
                  {!locked && (<><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: T.muted }}>Progress</span><span style={{ fontSize: 12, fontWeight: 600, color: T.green }}>{prog}%</span></div><ProgressBar pct={prog} color={completed ? T.gold : T.greenLight} /></>)}
                  {locked && <p style={{ fontSize: 12, color: T.muted }}>🔒 Reach GQ {c.gqReq} to unlock this level</p>}
                  {status === "In Progress" && <Btn style={{ marginTop: 14 }} onClick={() => toast("Resuming your certification modules…")}>Continue Learning →</Btn>}
                  {completed && <Btn variant="secondary" style={{ marginTop: 14 }} onClick={() => toast("Certificate downloaded (demo)")}>Download Certificate 📜</Btn>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BooksView({ toast }) {
  return (
    <div>
      <Header title="Susan's Books" sub="12 books on Gut Intelligence®, leadership & consciousness" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {BOOKS.map((b, i) => (
          <Card key={i} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 44, height: 56, background: `linear-gradient(135deg,${T.green},${T.greenLight})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📕</div>
              <Badge label={b.tag} color={T.green} bg={T.goldPale} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{b.title}</p>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 14, flex: 1 }}>{b.desc}</p>
            <Btn variant="secondary" full onClick={() => { window.open(b.url, "_blank"); toast("Opening book page…"); }}>View Book →</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ArticlesView({ toast }) {
  return (
    <div>
      <Header title="Articles & Insights" sub="Susan's Forbes Coaches Council articles & thought leadership" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ARTICLES.map((a, i) => (
          <Card key={i}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <Badge label={a.source} color={T.white} bg={T.gold} />
              <span style={{ fontSize: 12, color: T.muted, alignSelf: "center" }}>{a.year}</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{a.title}</p>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>{a.excerpt}</p>
            <Btn variant="secondary" onClick={() => { window.open(a.url, "_blank"); toast("Opening article…"); }}>Read Article →</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ProgramsView({ toast }) {
  return (
    <div>
      <Header title="GQ Programs" sub="Susan's flagship Gut Intelligence® programs" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {PROGRAMS.map((p, i) => (
          <Card key={i}>
            <Badge label={p.format} color={T.green} bg={T.goldPale} />
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: T.green, margin: "10px 0 8px" }}>{p.title}</h3>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => { window.open(p.url, "_blank"); toast("Opening program details…"); }}>Learn More →</Btn>
              <Btn variant="secondary" onClick={() => toast("Request sent — Susan's team will reach out")}>Request Info</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── small helpers ───
const Header = ({ title, sub, inline }) => (
  <div style={{ marginBottom: inline ? 0 : 24 }}>
    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: T.green, marginBottom: 4 }}>{title}</h1>
    {sub && <p style={{ color: T.muted, fontSize: 13 }}>{sub}</p>}
  </div>
);
const H3 = ({ children }) => <h3 style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, marginBottom: 16 }}>{children}</h3>;
const Row = ({ children, style }) => <div style={{ display: "flex", gap: 16, flexWrap: "wrap", ...style }}>{children}</div>;
const Avatar = ({ text, size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: size > 42 ? 10 : "50%", background: T.goldPale, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: T.green, fontSize: size * 0.32, flexShrink: 0 }}>{text}</div>
);
const Meter = ({ name, pct, color = T.greenLight }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: 13 }}>{name}</span><span style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>{pct}%</span></div>
    <ProgressBar pct={pct} color={color} />
  </div>
);
