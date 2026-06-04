import { useState, useEffect, useRef } from "react";
import { T } from "../lib/data.js";
import { Btn } from "../components/ui.jsx";

export function AICoach({ userType, userName }) {
  const greeting = userType === "org"
    ? "Welcome to your GQ AI Coach. I'm here to help you and your team apply Gut Intelligence® — synthesizing the wisdom of the gut, heart, head, and intuition. What's on your mind today?"
    : `Hello${userName ? " " + userName.split(" ")[0] : ""}! I'm your personal GQ AI Coach, grounded in Susan K. Wehrley's Gut Intelligence® methodology. Let's strengthen your gut-brain connection. What would you like to explore?`;

  const [messages, setMessages] = useState([{ role: "assistant", text: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (preset) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    const userMsg = { role: "user", text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a GQ AI Coach embedded in Susan K. Wehrley's Gut Intelligence® (GQ) platform. You deeply understand her trademarked methodology (2016):
- GQ = the ability to synthesize wisdom from four information centers: the GUT (the gut-alert / internal compass), the HEART (emotional data / the heart's desire), the HEAD (the field of possibilities / cognitive awareness), and INTUITION (the "a-ha" knowing).
- The S.T.O.P. Technique: Slow down and breathe, Tune in within, Observe what is happening, Perceive a new possibility.
- The SHIFT Effect: Sense misalignment, Harness intuition, Integrate insights, Focus on creation not reaction, Take inspired action (at "cheetah speed").
- Core idea: move out of the reactive (fight/flight/freeze) center of the brain, up the vagus nerve, into higher consciousness; align every decision to your VISION, VALUES, and GOALS. The E.G.O. "Edges Gut Intelligence Out."
- Favorite reframing question: "How might we...?"
You coach ${userType === "org" ? "organizational leaders and teams" : "individual executives and entrepreneurs"}. Be warm, wise, and concise. Ask powerful reflective questions. Reference Susan's methodology naturally. Keep replies to 2-4 short paragraphs.`,
          messages: history.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        }),
      });
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      const reply = data.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "I'm here with you. Could you share a little more?";
      setMessages((p) => [...p, { role: "assistant", text: reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", text: "I can't reach the coaching service right now. If you're running locally, make sure your ANTHROPIC_API_KEY is set in the .env file and the dev server was restarted. In the meantime: try the S.T.O.P. technique — Slow down, Tune in, Observe, and Perceive a new possibility." }]);
    }
    setLoading(false);
  };

  const suggestions = userType === "org"
    ? ["Our team seems misaligned on goals", "How do we build a GQ culture?", "We keep firefighting instead of planning"]
    : ["I can't trust my gut on a big decision", "Walk me through the S.T.O.P. technique", "I feel reactive under pressure"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: T.green, marginBottom: 2 }}>GQ AI Coach</h1>
        <p style={{ color: T.muted, fontSize: 13 }}>Powered by Susan K. Wehrley's Gut Intelligence® methodology</p>
      </div>
      <div style={{ flex: 1, background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(90deg,${T.green},${T.greenMid})`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: T.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: T.green, fontSize: 13, flexShrink: 0 }}>SK</div>
          <div>
            <p style={{ color: T.white, fontSize: 13, fontWeight: 500 }}>GQ Coach — Susan's Methodology</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Gut · Heart · Head · Intuition · S.T.O.P. · SHIFT</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, background: "#4ADE80", borderRadius: "50%" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Active</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              {m.role === "assistant" && <div style={{ width: 32, height: 32, background: T.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⚡</div>}
              <div style={{ maxWidth: "76%", background: m.role === "user" ? T.green : T.ivory, borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", border: m.role === "assistant" ? `1px solid ${T.border}` : "none" }}>
                <p style={{ fontSize: 14, color: m.role === "user" ? T.white : T.charcoal, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, background: T.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
              <div style={{ background: T.ivory, borderRadius: "14px 14px 14px 4px", padding: "14px 18px", border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 1, 2].map((j) => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: T.gold, animation: `bd 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ background: T.goldPale, color: T.green, border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Share what's on your mind — your gut is speaking…"
            style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 16px", fontSize: 14, background: T.ivory, outline: "none", color: T.charcoal }} />
          <Btn onClick={() => send()} disabled={!input.trim() || loading} style={{ padding: "11px 18px" }}>→</Btn>
        </div>
      </div>
      <style>{`@keyframes bd{0%,80%,100%{transform:scale(0);opacity:0.5}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
