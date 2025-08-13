// public/js/profile.js
// Uses your existing Firebase init at /public/js/firebase.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile, // <-- add this
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const emailEl = $("email");
const passEl  = $("password");
const createBtn = $("create");
const signInBtn = $("signin");
const forgotBtn = $("forgot");
const msg = $("status"); // matches <p id="status"> in profile.html;
const displayNameEl = $("displayName"); // <-- assumes you have <input id="displayName">

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

let first = true;
onAuthStateChanged(auth, async (u) => {
  const box = document.getElementById('profileBox');
  const emailOut = document.getElementById('email');

  if (u) {
    if (box) box.style.display = 'block';
    if (emailOut) emailOut.textContent = u.email || '—';

    // NEW: Save display name if provided
    if (displayNameEl && displayNameEl.value.trim()) {
      try {
        await updateProfile(u, { displayName: displayNameEl.value.trim() });
        setMsg("Profile updated", "ok");
      } catch (err) {
        setMsg(normalizeError(err?.code), "warn");
      }
    }

    setMsg("", true);
  } else if (!first) {
    // only redirect after the initial null to avoid the loop
    location.replace('./auth.html'); // or './login.html' if that’s your filename
  }
  first = false;
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
// Save display name (append at end of file)
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const saveBtn   = document.getElementById('save');
const nameInput = document.getElementById('displayName');
const statusEl  = document.getElementById('status');

saveBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  const u = auth.currentUser;
  if (!u) { if (statusEl) statusEl.textContent = "You’re signed out. Log in again."; return; }

  const name = (nameInput?.value || '').trim();
  if (!name) { if (statusEl) statusEl.textContent = "Enter a display name."; return; }

  try {
    await updateProfile(u, { displayName: name });
    if (statusEl) statusEl.textContent = "Saved.";
  } catch (err) {
    if (statusEl) statusEl.textContent = err?.message || "Couldn’t save.";
  }
});
