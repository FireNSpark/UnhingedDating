// public/js/auth.js  (ES module)
import { auth } from "./firebase.js";
import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const email = $("email");
const pass  = $("password");
const signInBtn = $("signInBtn");
const createBtn = $("createAccountBtn");
const statusEl  = $("status");
const forgotLink = document.querySelector(".forgot");

function msg(text, ok=false){
  if(!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#7CFF7C" : "#ffd166";
}
function goProfile(){
  location.assign(new URL("./profile.html", location).href);
}

// Persist session
await setPersistence(auth, browserLocalPersistence).catch(()=>{});

// Sign in
signInBtn?.addEventListener("click", async (e)=>{
  e.preventDefault();
  try{
    msg("Signing in…");
    await signInWithEmailAndPassword(auth, email.value.trim(), pass.value);
    msg("Signed in.", true);
    goProfile();
  }catch(err){ msg(pretty(err)); }
});

// Create account
createBtn?.addEventListener("click", async (e)=>{
  e.preventDefault();
  try{
    msg("Creating account…");
    await createUserWithEmailAndPassword(auth, email.value.trim(), pass.value);
    msg("Account created.", true);
    goProfile();
  }catch(err){ msg(pretty(err)); }
});

// Forgot password
forgotLink?.addEventListener("click", async (e)=>{
  e.preventDefault();
  if(!email.value.trim()) return msg("Enter your email first.");
  try{
    msg("Sending reset link…");
    await sendPasswordResetEmail(auth, email.value.trim());
    msg("Reset email sent.", true);
  }catch(err){ msg(pretty(err)); }
});

// Optional: show who is signed in
onAuthStateChanged(auth, (u)=>{
  if(u && statusEl) msg(`Signed in as ${u.email}`, true);
});

function pretty(err){
  const code = String(err?.code || "");
  return code
    ? code.replace("auth/","").replaceAll("-"," ").replace(/^./,s=>s.toUpperCase())
    : "Something went wrong.";
}
