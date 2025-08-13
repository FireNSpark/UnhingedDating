// public/js/auth.js
alert('auth.js loaded'); // TEMP probe so you see it’s running

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";

// Elements
const emailEl  = document.getElementById('email');
const passEl   = document.getElementById('password');
const statusEl = document.getElementById('status');

const signinBtn = document.getElementById('signin');
const createBtn = document.getElementById('create');
const forgotBtn = document.getElementById('forgot');

// Helpers
function msg(t, ok=false){
  if(!statusEl) return;
  statusEl.textContent = t || '';
  statusEl.className = ok ? 'ok' : 'warn';
}

// Actions
async function doSignIn(){
  alert('doSignIn running'); // TEMP probe
  try{
    msg('Signing in…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await signInWithEmailAndPassword(auth, em, pw);
    msg('Signed in!', true);
    location.assign('./profile.html');
  }catch(err){
    const m = err?.message || String(err);
    msg(m);
    alert('Sign-in error: ' + m); // <-- show the exact Firebase error
  }
}

async function doCreate(){
  try{
    msg('Creating account…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await createUserWithEmailAndPassword(auth, em, pw);
    msg('Account created!', true);
    location.assign('./profile.html');
  }catch(err){
    const m = err?.message || String(err);
    msg(m);
    alert('Create error: ' + m); // TEMP
  }
}

async function doForgot(){
  try{
    const em = (emailEl?.value || '').trim();
    if(!em){ msg('Enter your email first'); return; }
    await sendPasswordResetEmail(auth, em);
    msg('Reset email sent', true);
  }catch(err){
    const m = err?.message || String(err);
    msg(m);
    alert('Reset error: ' + m); // TEMP
  }
}

// Wire up
signinBtn?.addEventListener('click', doSignIn);
createBtn?.addEventListener('click', doCreate);
forgotBtn?.addEventListener('click', doForgot);
