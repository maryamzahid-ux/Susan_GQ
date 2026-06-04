// ─────────────────────────────────────────────────────────────
// GQ SCORING ENGINE
// Based directly on Susan K. Wehrley's Gut Intelligence® methodology:
// GQ = the ability to synthesize wisdom from the GUT, HEART, HEAD &
// INTUITION (the four information centers), applied via the S.T.O.P.
// technique. We assess each center with a short Likert (1–5) survey,
// weight the four centers equally, and normalize to 0–100.
// ─────────────────────────────────────────────────────────────

export const ASSESSMENT_QUESTIONS = [
  // GUT — sensing the gut-alert / misalignment early
  { id: "g1", center: "gut",   text: "I notice a physical 'gut-alert' (tightness, unease) when something is out of alignment with my values." },
  { id: "g2", center: "gut",   text: "When I sense something is off, I pause and pay attention rather than pushing through." },
  // HEART — emotional data / regulation
  { id: "h1", center: "heart", text: "I can name what I'm feeling in the moment and understand what it's telling me about direction." },
  { id: "h2", center: "heart", text: "Under pressure, I respond with purpose instead of reacting from fear, self-doubt, or judgment." },
  // HEAD — field of possibilities / strategic awareness
  { id: "d1", center: "head",  text: "Before deciding, I deliberately consider a range of possible strategies and outcomes." },
  { id: "d2", center: "head",  text: "I can step back and observe a situation from a neutral, fearlessly detached point of view." },
  // INTUITION — the a-ha knowing / alignment confidence
  { id: "i1", center: "intuition", text: "I get a clear 'a-ha' knowing when my gut, heart, and head all agree on a decision." },
  { id: "i2", center: "intuition", text: "I trust myself to make decisions aligned with my vision, values, and goals." },
];

// Compute per-center scores (0–100) and overall GQ from raw 1–5 answers.
// answers: { questionId: 1..5 }
export function computeGQ(answers) {
  const centers = ["gut", "heart", "head", "intuition"];
  const byCenter = {};
  centers.forEach((c) => {
    const qs = ASSESSMENT_QUESTIONS.filter((q) => q.center === c);
    const vals = qs.map((q) => answers[q.id]).filter((v) => typeof v === "number");
    if (vals.length === 0) { byCenter[c] = 0; return; }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length; // 1..5
    byCenter[c] = Math.round(((avg - 1) / 4) * 100); // normalize 1–5 → 0–100
  });
  // Equal-weight synthesis across the four centers (Susan: "synthesize the wisdom")
  const overall = Math.round(centers.reduce((sum, c) => sum + byCenter[c], 0) / centers.length);
  return { overall, byCenter };
}

export function gqBand(score) {
  if (score >= 85) return { label: "Cheetah — Self-Mastery", color: "#1B7A4F", note: "Your gut, heart, head & intuition operate as one. You respond with precision under pressure." };
  if (score >= 70) return { label: "Strong Alignment",        color: "#B7882C", note: "Your gut-brain connection is well developed. Keep refining decision clarity." };
  if (score >= 50) return { label: "Emerging Awareness",      color: "#D4A847", note: "You're learning to notice the gut-alert. Practice the pause with S.T.O.P." };
  return                  { label: "Reactive Center",         color: "#C0392B", note: "Fear, self-doubt & judgment may be Edging Gut Intelligence Out. Start with the foundations." };
}

export const LIKERT = [
  { v: 1, label: "Strongly disagree" },
  { v: 2, label: "Disagree" },
  { v: 3, label: "Neutral" },
  { v: 4, label: "Agree" },
  { v: 5, label: "Strongly agree" },
];

// ─────────────────────────────────────────────────────────────
// ORGANIZATION GQ ASSESSMENT
// Six dimensions grounded in Susan's GQ Architecture program:
//   1. Gut-Alert Culture      — org notices misalignment early (not "fire-fire-fire")
//   2. Emotional Safety       — psychological safety to surface honest emotional data
//   3. Strategic Field        — leadership explores full field of possibilities
//   4. Aligned Intuition      — decisions align to shared vision, values & goals
//   5. Leadership Role Fit    — people are in roles that match their strengths & values
//   6. Communication Clarity  — the org has the courageous conversations it needs
// Two questions per dimension → 12 questions total → each dimension 0–100
// Overall org GQ = equal-weight average of the six.
// ─────────────────────────────────────────────────────────────
export const ORG_DIMENSIONS = [
  { key: "gutAlert",      label: "Gut-Alert Culture",     icon: "🧭",
    desc: "Leaders notice misalignment signals before they hit the bottom line — moving from Fire-Fire-Fire to Ready-Aim-Fire." },
  { key: "emotionalSafety", label: "Emotional Safety",   icon: "💚",
    desc: "The organization creates safety for honest emotional data — the Heart's Desire — to surface without fear of judgment." },
  { key: "strategicField", label: "Strategic Field",     icon: "🧠",
    desc: "Leadership consistently opens the 'Field of Possibilities' before committing to a direction." },
  { key: "alignedIntuition", label: "Aligned Intuition", icon: "✨",
    desc: "Decisions across the organization consistently align to the shared vision, values, and goals." },
  { key: "roleAlignment",  label: "Leadership Role Fit", icon: "🎯",
    desc: "Leaders and team members are in roles that match their natural strengths and core values." },
  { key: "communication",  label: "Communication Clarity", icon: "🔊",
    desc: "The organization has the courageous, direct conversations it needs — avoiding the costly silence of unspoken misalignment." },
];

export const ORG_QUESTIONS = [
  // 1. Gut-Alert Culture
  { id: "oc1", dim: "gutAlert",
    text: "In our organization, leaders reliably notice when something feels 'off' and pause to examine it — rather than reacting or pushing through." },
  { id: "oc2", dim: "gutAlert",
    text: "When a project or decision produces unease in the team, we treat that as important information rather than noise to be suppressed." },
  // 2. Emotional Safety
  { id: "oe1", dim: "emotionalSafety",
    text: "People in our organization feel safe expressing concerns or disagreements without fear of judgment, blame, or retaliation." },
  { id: "oe2", dim: "emotionalSafety",
    text: "Our leadership culture encourages people to bring their whole selves — including emotional data — to important decisions." },
  // 3. Strategic Field
  { id: "os1", dim: "strategicField",
    text: "Before committing to a major decision, our leaders routinely explore a full range of options rather than defaulting to the first solution." },
  { id: "os2", dim: "strategicField",
    text: "We regularly ask 'How might we...?' to open creative possibilities rather than getting locked into binary thinking." },
  // 4. Aligned Intuition
  { id: "oi1", dim: "alignedIntuition",
    text: "The decisions our organization makes are consistently aligned to our stated vision, values, and strategic goals." },
  { id: "oi2", dim: "alignedIntuition",
    text: "When a decision or strategy doesn't feel right — even if it looks good on paper — we pause and investigate before proceeding." },
  // 5. Leadership Role Fit
  { id: "or1", dim: "roleAlignment",
    text: "Leaders and key team members are in roles that genuinely leverage their natural strengths and align with their core values." },
  { id: "or2", dim: "roleAlignment",
    text: "When someone is misaligned in their role, our organization addresses it openly rather than tolerating or ignoring the misfit." },
  // 6. Communication Clarity
  { id: "om1", dim: "communication",
    text: "Our organization has the courageous conversations it needs — difficult truths are surfaced, not avoided." },
  { id: "om2", dim: "communication",
    text: "There is a high level of clarity and alignment across teams about what we are building, why it matters, and how each person contributes." },
];

export function computeOrgGQ(answers) {
  const dims = ORG_DIMENSIONS.map((d) => d.key);
  const byDim = {};
  dims.forEach((d) => {
    const qs = ORG_QUESTIONS.filter((q) => q.dim === d);
    const vals = qs.map((q) => answers[q.id]).filter((v) => typeof v === "number");
    if (!vals.length) { byDim[d] = 0; return; }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    byDim[d] = Math.round(((avg - 1) / 4) * 100);
  });
  const overall = Math.round(dims.reduce((s, d) => s + byDim[d], 0) / dims.length);
  return { overall, byDim };
}

export function orgGQBand(score) {
  if (score >= 85) return { label: "Cheetah Organization",   color: "#1B7A4F", note: "Your organization operates with the speed and precision of a cheetah — gut, heart, head & intuition fully aligned across leadership and culture." };
  if (score >= 70) return { label: "Aligned Culture",        color: "#B7882C", note: "Strong organizational GQ. Leaders notice misalignment early and your culture supports honest decision-making." };
  if (score >= 50) return { label: "Emerging Awareness",     color: "#D4A847", note: "Your organization is developing GQ awareness. There are pockets of alignment but key gaps in culture, communication, or role fit." };
  return                  { label: "Reactive Organization",  color: "#C0392B", note: "The E.G.O. (Edges Gut Intelligence Out) is dominant. Fear, silos, or misaligned roles are creating a Fire-Fire-Fire culture." };
}

// Recommendations per low-scoring dimension
export const ORG_RECOMMENDATIONS = {
  gutAlert:        "Start regular 'misalignment check-ins' — brief moments before major meetings where leaders voice gut-alerts without judgment. Practice the S.T.O.P. technique at the leadership level.",
  emotionalSafety: "Invest in psychological safety training. Use the GQ Architecture's Heart center tools to normalize emotional data in decision-making conversations.",
  strategicField:  "Build 'How might we...?' into your decision-making rituals. Require that at least three strategic options be explored before any major commitment.",
  alignedIntuition:"Run a Vision-Values-Goals alignment workshop. Ensure every major decision is explicitly checked against the org's stated VVG before being finalized.",
  roleAlignment:   "Conduct a Role-Strength alignment audit. Use GQ individual assessments to identify leaders whose natural strengths and values are mismatched with their current role.",
  communication:   "Introduce structured courageous-conversation protocols. Create forums where silence is treated as a signal of unspoken misalignment, not agreement.",
};
