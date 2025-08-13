// public/js/auth.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- element refs (match login.html) ---
const $ = (id) => document.getElementById(id);
const emailEl   = $("email");
const passEl    = $("password");
const signInBtn = $("signin");
const createBtn = $("create");
const forgotBtn = $("forgot");
const statusEl  = $("status"); // message area

// --- helpers ---
function msg(text = "", ok = false) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = ok ? "ok" : "warn";
}
function busy(on = true) {
  [signInBtn, createBtn, forgotBtn].forEach((b) => b && (b.disabled = on));
}
function goProfile() {
  // relative path so it works on subpath hosting
  location.replace("./profile.html");
}
function norm(code) {
  switch (code) {
    case "auth/invalid-email": return "Invalid email format.";
    case "auth/missing-password": return "Enter your password.";
    case "auth/weak-password": return "Password must be 6+ chars.";
    case "auth/email-already-in-use": return "Account exists. Try Sign in.";
    case "auth/invalid-credential":
    case "auth/wrong-password": return "Email or password is incorrect.";
    case "auth/user-not-found": return "No account for that email.";
    case "auth/network-request-failed": return "Network error. Check connection.";
    default: return "Couldn’t complete the request.";
  }
}

// --- auto-redirect if already signed in ---
onAuthStateChanged(auth, (u) => { if (u) goProfile(); });

// --- actions ---
async function doSignIn() {
  const email = (emailEl?.value || "").trim();
  const pass  = passEl?.value || "";
  if (!email || !pass) { msg("Email & password required."); return; }
  busy(true); msg("Signing in…");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    msg("", true);
    goProfile();
  } catch (e) {
    msg(norm(e?.code));
  } finally { busy(false); }
}

async function doCreate() {
  const email = (emailEl?.value || "").trim();
  const pass  = passEl?.value || "";
  if (!email || !pass) { msg("Email & password required."); return; }
  busy(true); msg("Creating account…");
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    msg("", true);
    goProfile();
  } catch (e) {
    msg(norm(e?.code));
  } finally { busy(false); }
}

async function doReset() {
  const email = (emailEl?.value || "").trim();
  if (!email) { msg("Enter your email first."); return; }
  busy(true); msg("Sending reset…");
  try {
    await sendPasswordResetEmail(auth, email);
    msg("Reset email sent.", true);
  } catch (e) {
    msg(norm(e?.code));
  } finally { busy(false); }
}

// --- wiring ---
signInBtn?.addEventListener("click", (e) => { e.preventDefault(); doSignIn(); });
createBtn?.addEventListener("click", (e) => { e.preventDefault(); doCreate(); });
forgotBtn?.addEventListener("click", (e) => { e.preventDefault(); doReset(); });

[emailEl, passEl].forEach((el) => {
  el?.addEventListener("keydown", (e) => { if (e.key === "Enter") doSignIn(); });
});
