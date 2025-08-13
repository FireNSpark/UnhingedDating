// public/js/auth.js

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
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

// Wait for auth state before redirecting
function redirectToProfileWhenReady(){
  onAuthStateChanged(auth, (user) => {
    if(user) {
      location.replace('./profile.html');
    }
  });
}

// Actions
async function doSignIn(){
  try{
    msg('Signing in…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await signInWithEmailAndPassword(auth, em, pw);
    msg('Signed in!', true);
    redirectToProfileWhenReady();
  }catch(err){
    const m = err?.message || String(err);
    msg(m);
    alert('Sign-in error: ' + m);
  }
}

async function doCreate(){
  try{
    msg('Creating account…');
    const em = (emailEl?.value || '').trim();
    const pw = passEl?.value || '';
    await createUserWithEmailAndPassword(auth, em, pw);
    msg('Account created!', true);
    redirectToProfileWhenReady();
  }catch(err){
    const m = err?.message || String(err);
    msg(m);
    alert('Create error: ' + m);
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
    alert('Reset error: ' + m);
  }
}

// Wire up
signinBtn?.addEventListener('click', doSignIn);
createBtn?.addEventListener('click', doCreate);
forgotBtn?.addEventListener('click', doForgot);
