// public/js/auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";

// Persist auth session so reloads don’t log out
await setPersistence(auth, browserLocalPersistence).catch(() => {});

// Elements
const emailEl  = document.getElementById('email');
const passEl   = document.getElementById('password');
const statusEl = document.getElementById('status');

const signinBtn = document.getElementById('signin');
const createBtn = document.getElementById('create');
const forgotBtn = document.getElementById('forgot');

// Helper
function msg(t, ok=false){
  if(!statusEl) return;
  statusEl.textContent = t || '';
  statusEl.className = ok ? 'ok' : 'warn';
}

// Actions
async function doSignIn(){
  try{
    msg('Signing in…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await signInWithEmailAndPassword(auth, em, pw);
    msg('Signed in!', true);
    location.replace('./home.html'); // redirect to your main app page
  }catch(err){
    msg(err?.message || String(err));
  }
}

async function doCreate(){
  try{
    msg('Creating account…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await createUserWithEmailAndPassword(auth, em, pw);
    msg('Account created!', true);
    location.replace('./profile.html'); // new users go set username
  }catch(err){
    msg(err?.message || String(err));
  }
}

async function doForgot(){
  try{
    const em = (emailEl?.value || '').trim();
    if(!em){ msg('Enter your email first'); return; }
    await sendPasswordResetEmail(auth, em);
    msg('Reset email sent', true);
  }catch(err){
    msg(err?.message || String(err));
  }
}

// Wire up
signinBtn?.addEventListener('click', doSignIn);
createBtn?.addEventListener('click', doCreate);
forgotBtn?.addEventListener('click', doForgot);
