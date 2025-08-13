// public/js/auth.js
// Uses the existing initializer in ./firebase.js — no config here.
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const emailEl = $("email");
const passEl  = $("password");
const msg     = $("msg");

function say(text, cls = "") {
  if (!msg) return;
  msg.className = cls ? `msg ${cls}` : "msg";
  msg.textContent = text;
}

function goProfile() {
  // robust redirect that works on subpaths too
  location.assign(new URL("./profile.html", location).href);
}

// Already signed in? Go to profile.
onAuthStateChanged(auth, (user) => {
  if (user && !location.pathname.endsWith("/profile.html")) goProfile();
});

// Sign In
$("signin")?.addEventListener("click", async () => {
  say("Signing in…");
  try {
    await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    say("Signed in.", "ok");
    goProfile();
  } catch (e) {
    say(pretty(e), "err");
  }
});

// Create Account
$("signup")?.addEventListener("click", async () => {
  say("Creating account…");
  try {
    await createUserWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    say("Account created.", "ok");
    goProfile();
  } catch (e) {
    say(pretty(e), "err");
  }
});

// Forgot password
$("forgot")?.addEventListener("click", async (ev) => {
  ev.preventDefault();
  const email = emailEl.value.trim();
  if (!email) return say("Enter your email first.", "err");
  say("Sending reset link…");
  try {
    await sendPasswordResetEmail(auth, email);
    say("Reset link sent. Check your inbox.", "ok");
  } catch (e) {
    say(pretty(e), "err");
  }
});

// Friendly error text
function pretty(err) {
  const m = String(err?.message || err);
  if (m.includes("auth/invalid-credential")) return "Wrong email or password.";
  if (m.includes("auth/email-already-in-use")) return "That email already has an account.";
  if (m.includes("auth/weak-password")) return "Password is too weak.";
  if (m.includes("auth/invalid-email")) return "That email doesn’t look right.";
  return m.replace(/^Firebase:\s*/i, "");
}
