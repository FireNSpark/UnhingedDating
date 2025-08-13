// public/js/auth.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---- helpers ----
const $ = (id) => document.getElementById(id);
const emailEl = $("email");
const passEl  = $("password");
const createBtn = $("create");
const signInBtn = $("signin");
const forgotBtn = $("forgot");
const statusEl = $("status");

function msg(text, ok=false){
  if(!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = ok ? "ok" : "warn";
}

function busy(on){
  [createBtn, signInBtn, forgotBtn].forEach(b => b && (b.disabled = on));
}

// ---- actions ----
async function doCreate(){
  busy(true); msg("Creating account…");
  try{
    const em = emailEl.value.trim();
    const pw = passEl.value;
    await createUserWithEmailAndPassword(auth, em, pw);
    msg("Account created. Redirecting…", true);
    location.assign("./profile.html");
  }catch(e){
    msg(e?.message || "Couldn’t create account");
  }finally{ busy(false); }
}

async function doSignIn(){
  busy(true); msg("Signing in…");
  try{
    const em = emailEl.value.trim();
    const pw = passEl.value;
    await signInWithEmailAndPassword(auth, em, pw);
    msg("Signed in. Redirecting…", true);
    location.assign("./profile.html");
  }catch(e){
    msg(e?.message || "Sign-in failed");
  }finally{ busy(false); }
}

async function doReset(){
  busy(true); msg("Sending reset…");
  try{
    const em = emailEl.value.trim();
    if(!em) throw new Error("Enter your email to reset.");
    await sendPasswordResetEmail(auth, em);
    msg("Password reset email sent.", true);
  }catch(e){
    msg(e?.message || "Couldn’t send reset");
  }finally{ busy(false); }
}

// ---- wiring ----
createBtn?.addEventListener("click", doCreate);
signInBtn?.addEventListener("click", doSignIn);
forgotBtn?.addEventListener("click", doReset);

// Optional: allow Enter key to submit
[emailEl, passEl].forEach(el=>{
  el?.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") doSignIn();
  });
});

// Keep UI in sync
onAuthStateChanged(auth, (u)=>{
  if(u){
    msg(`Signed in as ${u.email}`, true);
  }else{
    msg("Not signed in.");
  }
});
