import { useState } from "react";
import { T } from "../lib/data.js";
import { ORG_QUESTIONS, ORG_DIMENSIONS, computeOrgGQ, orgGQBand, ORG_RECOMMENDATIONS, LIKERT } from "../lib/gq.js";
import { GQRing, Btn, ProgressBar, Badge } from "../components/ui.jsx";

export function OrgAssessment({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const total = ORG_QUESTIONS.length;
  const q = ORG_QUESTIONS[step];
  const dim = ORG_DIMENSIONS.find((d) => d.key === q?.dim);
  const answered = answers[q?.id];
  const dimIndex = ORG_DIMENSIONS.findIndex((d) => d.key === q?.dim);

  const choose = (v) => {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else setResult(computeOrgGQ(next));
    }, 220);
  };

  if (result) return <Results result={result} onComplete={onComplete} />;

  const pct = (step / total) * 100;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.white, borderRadius: 20, width: 640, maxWidth: "100%", padding: "36px 40px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <p style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: "0.08em" }}>ORGANIZATIONAL GQ ASSESSMENT</p>
          <p style={{ fontSize: 12, color: T.muted }}>{step + 1} / {total}</p>
        </div>

        {/* Progress — with dimension markers */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: T.ivoryDark, borderRadius: 6, height: 7, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: T.gold, borderRadius: 6, transition: "width 0.4s ease" }} />
          </div>
          {/* Dimension bubbles */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ORG_DIMENSIONS.map((d, i) => {
              const dimDone = step >= (i + 1) * 2;
              const dimActive = dimIndex === i;
              return (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 4, background: dimDone ? T.goldPale : dimActive ? T.goldPale : T.ivoryDark, borderRadius: 20, padding: "3px 10px", border: `1px solid ${dimActive ? T.gold : "transparent"}` }}>
                  <span style={{ fontSize: 12 }}>{d.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, color: dimDone ? T.gold : dimActive ? T.green : T.muted }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current dimension */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>{dim.icon}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.green }}>{dim.label}</p>
            <p style={{ fontSize: 11, color: T.muted }}>{dim.desc}</p>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: T.charcoal, lineHeight: 1.45, marginBottom: 26 }}>
          {q.text}
        </h2>

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
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
            style={{ background: "transparent", border: "none", color: step === 0 ? T.border : T.muted, fontSize: 13, cursor: step === 0 ? "default" : "pointer" }}>← Previous</button>
          <button onClick={onSkip} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 13, cursor: "pointer" }}>Skip for now →</button>
        </div>
      </div>
    </div>
  );
}

function Results({ result, onComplete }) {
  const band = orgGQBand(result.overall);
  const weak = ORG_DIMENSIONS.filter((d) => result.byDim[d.key] < 60).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.green},${T.greenMid})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.white, borderRadius: 20, width: 680, maxWidth: "100%", padding: "40px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", maxHeight: "92vh", overflowY: "auto" }}>

        {/* Score hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 10 }}>YOUR ORGANIZATION'S GUT INTELLIGENCE® SCORE</p>
          <GQRing score={result.overall} size={130} stroke={9} />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: band.color, margin: "14px 0 8px" }}>{band.label}</h1>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>{band.note}</p>
        </div>

        {/* Explanation */}
        <div style={{ background: T.goldPale, borderRadius: 10, padding: "14px 16px", marginBottom: 24, borderLeft: `3px solid ${T.gold}` }}>
          <p style={{ fontSize: 12, color: T.green, lineHeight: 1.7 }}>
            <strong>How this is scored:</strong> Your organizational GQ synthesizes six dimensions from Susan's GQ Architecture: Gut-Alert Culture, Emotional Safety, Strategic Field, Aligned Intuition, Leadership Role Fit, and Communication Clarity — two questions each, weighted equally. It measures how well your organization as a collective "inner Board of Directors" operates.
          </p>
        </div>

        {/* Six dimension breakdown */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, marginBottom: 14 }}>Six-Dimension Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {ORG_DIMENSIONS.map((d) => {
            const s = result.byDim[d.key];
            const color = s >= 70 ? T.greenLight : s >= 50 ? T.gold : "#C0392B";
            return (
              <div key={d.key} style={{ background: T.ivory, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.icon} {d.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color }}>{s}</span>
                </div>
                <ProgressBar pct={s} color={color} />
                {s < 60 && <p style={{ fontSize: 11, color: "#C0392B", marginTop: 5 }}> Priority area</p>}
              </div>
            );
          })}
        </div>

        {/* Priority recommendations */}
        {weak.length > 0 && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, marginBottom: 14 }}>Priority Recommendations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {weak.map((d) => (
                <div key={d.key} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px", borderLeft: `4px solid #C0392B` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{d.icon}</span>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{d.label}</p>
                    <Badge label={`Score: ${result.byDim[d.key]}`} color="#C0392B" bg="#FBEAE8" />
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{ORG_RECOMMENDATIONS[d.key]}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <Btn full onClick={() => onComplete(result)} style={{ padding: "13px" }}>
          Enter the Platform →
        </Btn>
      </div>
    </div>
  );
}
