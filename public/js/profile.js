// public/js/profile.js
// Uses your existing Firebase init at /public/js/firebase.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const emailEl = $("email");
const passEl  = $("password");
const createBtn = $("create");
const signInBtn = $("signin");
const forgotBtn = $("forgot");
const msg = $("msg");

function setMsg(t, type="") {
  if (!msg) return;
  msg.textContent = t || "";
  msg.className = type;
}
function busy(on=true) {
  [createBtn, signInBtn, forgotBtn].forEach(b => b && (b.disabled = on));
}
function goProfile() {
  location.replace("./profile.html");
}

function normalizeError(code){
  switch(code){
    case "auth/invalid-email": return "That email looks wrong.";
    case "auth/missing-password": return "Enter a password.";
    case "auth/weak-password": return "Password must be 6+ characters.";
    case "auth/email-already-in-use": return "Account already exists. Try Sign in.";
    case "auth/invalid-credential":
    case "auth/wrong-password": return "Email or password is incorrect.";
    case "auth/user-not-found": return "No account for that email.";
    default: return "Something went sideways. Try again.";
  }
}

onAuthStateChanged(auth, (u) => {
  if (!u) {
    // If you want to bounce signed‑out users away from the profile page, use your auth page:
    // location.replace('./login.html'); // or './auth.html' if that’s your filename
    return; // <- don’t redirect on the initial null to avoid the loop
  }
  // user is signed in — show the page UI (no redirect here)
});

async function doCreate() {
  const email = (emailEl?.value || "").trim();
  const pass  = passEl?.value || "";
  if (!email || !pass){ setMsg("Email & password required.", "warn"); return; }
  busy(true); setMsg("Creating account...");
  try{
    await createUserWithEmailAndPassword(auth, email, pass);
    setMsg(""); goProfile();
  }catch(err){
    setMsg(normalizeError(err?.code), "warn");
  }finally{ busy(false); }
}

async function doSignIn() {
  const email = (emailEl?.value || "").trim();
  const pass  = passEl?.value || "";
  if (!email || !pass){ setMsg("Email & password required.", "warn"); return; }
  busy(true); setMsg("Signing in...");
  try{
    await signInWithEmailAndPassword(auth, email, pass);
    setMsg(""); goProfile();
  }catch(err){
    setMsg(normalizeError(err?.code), "warn");
  }finally{ busy(false); }
}

async function doReset() {
  const email = (emailEl?.value || "").trim();
  if (!email){ setMsg("Enter your email first.", "warn"); return; }
  busy(true); setMsg("Sending reset link...");
  try{
    await sendPasswordResetEmail(auth, email);
    setMsg("Check your inbox for the reset link.", "ok");
  }catch(err){
    setMsg(normalizeError(err?.code), "warn");
  }finally{ busy(false); }
}

createBtn?.addEventListener("click", (e)=>{ e.preventDefault(); doCreate(); });
signInBtn?.addEventListener("click", (e)=>{ e.preventDefault(); doSignIn(); });
forgotBtn?.addEventListener("click", (e)=>{ e.preventDefault(); doReset(); });

[emailEl, passEl].forEach(el=>{
  el?.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") doSignIn();
  });
});
