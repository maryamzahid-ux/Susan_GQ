import { useState } from "react";
import { T, GQ_CENTERS } from "../lib/data.js";
import { ASSESSMENT_QUESTIONS, computeGQ, gqBand, LIKERT } from "../lib/gq.js";
import { GQRing, Btn, ProgressBar } from "../components/ui.jsx";

export function Assessment({ onComplete, onSkip }) {
  const [step, setStep] = useState(0); // 0..questions.length-1, then results
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const q = ASSESSMENT_QUESTIONS[step];
  const center = GQ_CENTERS.find((c) => c.key === q?.center);
  const total = ASSESSMENT_QUESTIONS.length;
  const answered = answers[q?.id];

  const choose = (v) => {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else setResult(computeGQ(next));
    }, 220);
  };

  if (result) {
    const band = gqBand(result.overall);
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: T.white, borderRadius: 20, width: 560, maxWidth: "100%", padding: "40px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
          <p style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>YOUR GUT INTELLIGENCE® SCORE</p>
          <div style={{ margin: "8px 0 16px" }}><GQRing score={result.overall} size={140} stroke={9} /></div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: band.color, marginBottom: 8 }}>{band.label}</h1>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, maxWidth: 420, margin: "0 auto 24px" }}>{band.note}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, textAlign: "left" }}>
            {GQ_CENTERS.map((c) => (
              <div key={c.key} style={{ background: T.ivory, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.charcoal }}>{c.icon} {c.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.gold }}>{result.byCenter[c.key]}</span>
                </div>
                <ProgressBar pct={result.byCenter[c.key]} />
              </div>
            ))}
          </div>

          <div style={{ background: T.goldPale, borderRadius: 10, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
            <p style={{ fontSize: 12, color: T.green, lineHeight: 1.6 }}>
              <strong>How this is scored:</strong> Your GQ synthesizes the wisdom of your four information centers — Gut, Heart, Head & Intuition — each weighted equally and normalized to 0–100, exactly as Susan's methodology defines Gut Intelligence®.
            </p>
          </div>

          <Btn full onClick={() => onComplete(result)} style={{ padding: "13px" }}>Enter the Platform →</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.white, borderRadius: 20, width: 600, maxWidth: "100%", padding: "36px 40px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: "0.08em" }}>GQ ASSESSMENT</p>
          <p style={{ fontSize: 12, color: T.muted }}>Question {step + 1} of {total}</p>
        </div>
        <div style={{ marginBottom: 28 }}><ProgressBar pct={((step) / total) * 100} color={T.gold} /></div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>{center.icon}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.green }}>{center.label}</p>
            <p style={{ fontSize: 11, color: T.muted }}>{center.signal}</p>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, color: T.charcoal, lineHeight: 1.4, marginBottom: 28 }}>{q.text}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LIKERT.map((opt) => (
            <button key={opt.v} onClick={() => choose(opt.v)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderRadius: 11, border: `1.5px solid ${answered === opt.v ? T.gold : T.border}`, background: answered === opt.v ? T.goldPale : T.white, cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${answered === opt.v ? T.gold : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: answered === opt.v ? T.gold : T.muted, flexShrink: 0 }}>{opt.v}</div>
              <span style={{ fontSize: 14, color: T.charcoal, fontWeight: 500 }}>{opt.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button onClick={() => step > 0 ? setStep(step - 1) : null} disabled={step === 0}
            style={{ background: "transparent", border: "none", color: step === 0 ? T.border : T.muted, fontSize: 13, cursor: step === 0 ? "default" : "pointer" }}>← Previous</button>
          <button onClick={onSkip} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 13, cursor: "pointer" }}>Skip for now →</button>
        </div>
      </div>
    </div>
  );
}
