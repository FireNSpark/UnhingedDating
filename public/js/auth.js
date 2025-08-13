// public/js/auth.js  (type="module")
import { auth } from "./firebase.js";
import {
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---- DOM ----
const $ = (s) => document.querySelector(s);
const emailEl = $("#email");
const passEl  = $("#password");
const signIn  = $("#signInBtn");
const signUp  = $("#signUpBtn");
const forgot  = $("#forgotBtn");
const status  = $("#authStatus");

function uiBusy(v) {
  [signIn, signUp, forgot].forEach(b => b && (b.disabled = v));
  if (v) status && (status.textContent = "Working…");
}
function setMsg(txt, ok=false) {
  if (!status) return;
  status.textContent = txt;
  status.style.color = ok ? "#7CFF7C" : "#ffd166";
}

// Persist login in this browser
setPersistence(auth, browserLocalPersistence).catch(()=>{});

// Sign in
signIn?.addEventListener("click", async (e) => {
  e.preventDefault();
  uiBusy(true);
  try {
    await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    setMsg("Signed in! Redirecting…", true);
    setTimeout(()=> location.assign("/"), 600);
  } catch (err) {
    setMsg(cleanErr(err));
  } finally { uiBusy(false); }
});

// Create account
signUp?.addEventListener("click", async (e) => {
  e.preventDefault();
  uiBusy(true);
  try {
    await createUserWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    setMsg("Account created! Redirecting…", true);
    setTimeout(()=> location.assign("/"), 800);
  } catch (err) {
    setMsg(cleanErr(err));
  } finally { uiBusy(false); }
});

// Forgot password
forgot?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!emailEl.value.trim()) return setMsg("Enter your email first.");
  uiBusy(true);
  try {
    await sendPasswordResetEmail(auth, emailEl.value.trim());
    setMsg("Password reset email sent.", true);
  } catch (err) {
    setMsg(cleanErr(err));
  } finally { uiBusy(false); }
});

// Live auth state (optional status)
onAuthStateChanged(auth, (u) => {
  if (u) setMsg(`Signed in as ${u.email}`, true);
});

function cleanErr(err){
  const m = (err?.code || "").replace("auth/", "").replaceAll("-", " ");
  return m ? m.charAt(0).toUpperCase()+m.slice(1) : "Something went wrong.";
}
