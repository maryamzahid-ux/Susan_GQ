// ─────────────────────────────────────────────────────────────
// AUTH STORE — simple, real auth flow with persistence.
// Demo-grade (client-side, hashed-ish): in production this would call
// a backend. Supports signup, login, role selection, logout, and a
// seeded admin account for Susan.
// ─────────────────────────────────────────────────────────────

const USERS_KEY = "gq_users";
const SESSION_KEY = "gq_session";

// lightweight non-cryptographic hash (demo only — never for real secrets)
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return String(h);
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    // seed Susan's admin account once
    if (!users.find((u) => u.email === "susan@bizremedies.com")) {
      users.push({
        email: "susan@bizremedies.com", name: "Susan K. Wehrley",
        role: "admin", pass: hash("gutintelligence"), gq: null, createdAt: Date.now(),
      });
      saveUsers(users);
    }
    return users;
  } catch { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setSession(user) {
  const safe = { email: user.email, name: user.name, role: user.role, org: user.org || null };
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(safe)); } catch {}
  return safe;
}

export function signup({ name, email, password, role, org }) {
  const users = loadUsers();
  const exists = users.find((u) => u.email === email.toLowerCase().trim());
  if (exists) return { error: "An account with that email already exists. Try logging in." };
  if (!name?.trim()) return { error: "Please enter your name." };
  if (!email?.includes("@")) return { error: "Please enter a valid email." };
  if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
  const user = {
    email: email.toLowerCase().trim(), name: name.trim(), role,
    org: org || null, pass: hash(password), gq: null, createdAt: Date.now(),
  };
  users.push(user);
  saveUsers(users);
  return { user: setSession(user) };
}

export function login({ email, password }) {
  const users = loadUsers();
  const user = users.find((u) => u.email === email.toLowerCase().trim());
  if (!user) return { error: "No account found with that email." };
  if (user.pass !== hash(password)) return { error: "Incorrect password. Please try again." };
  return { user: setSession(user) };
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

// persist a user's GQ assessment result
export function saveGQ(email, gqResult) {
  const users = loadUsers();
  const u = users.find((x) => x.email === email);
  if (u) { u.gq = gqResult; saveUsers(users); }
}

export function getGQ(email) {
  const users = loadUsers();
  return users.find((x) => x.email === email)?.gq || null;
}

// demo credentials helper for the login screen
export const DEMO = {
  admin: { email: "susan@bizremedies.com", password: "gutintelligence" },
};

// ─────────────────────────────────────────────────────────────
// ADMIN CRUD — called only from the admin panel
// ─────────────────────────────────────────────────────────────

export function getAllUsers() {
  return loadUsers().filter((u) => u.role !== "admin");
}

export function addUserByAdmin({ name, email, role, org, jobTitle, notes }) {
  const users = loadUsers();
  if (users.find((u) => u.email === email?.toLowerCase().trim()))
    return { error: "Email already registered." };
  if (!name?.trim() || !email?.includes("@"))
    return { error: "Name and valid email are required." };
  const user = {
    email: email.toLowerCase().trim(), name: name.trim(), role,
    org: org || null, jobTitle: jobTitle || null, notes: notes || null,
    pass: hash("Welcome1!"), // temp password — user resets on first login
    gq: null, sessions: 0, lastActive: null,
    status: "invited",           // invited | active | inactive
    createdAt: Date.now(), addedBy: "admin",
  };
  users.push(user);
  saveUsers(users);
  return { user };
}

export function updateUser(email, patch) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return { error: "User not found." };
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return { user: users[idx] };
}

export function deleteUser(email) {
  const users = loadUsers();
  saveUsers(users.filter((u) => u.email !== email));
}

// Org-level helpers — orgs are synthesized from users who share org name
export function getOrgs() {
  const users = loadUsers().filter((u) => u.role === "org" && u.org);
  const map = {};
  users.forEach((u) => {
    if (!map[u.org]) map[u.org] = { name: u.org, members: [], createdAt: u.createdAt };
    map[u.org].members.push(u);
  });
  return Object.values(map);
}

export function addOrgByAdmin({ orgName, adminName, adminEmail, license, notes }) {
  // Creates the org account holder (role: org)
  return addUserByAdmin({
    name: adminName, email: adminEmail, role: "org",
    org: orgName, notes: `License: ${license || "Starter"}. ${notes || ""}`,
  });
}
